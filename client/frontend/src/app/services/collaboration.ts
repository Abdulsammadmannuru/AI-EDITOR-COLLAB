import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CollaborationMessage {
  roomId: string;
  userId: string;
  content: string;
  operation: 'join' | 'leave' | 'update' | 'cursor';
  timestamp: number;
  metadata?: any;
}

@Injectable({
  providedIn: 'root'
})
export class CollaborationService {
  private stompClient: Client | null = null;
  private connectionStatus = new BehaviorSubject<boolean>(false);
  private messages = new BehaviorSubject<CollaborationMessage | null>(null);

  private wsUrl = 'http://localhost:8080/ws';
  private currentRoomId: string | null = null;
  private currentUserId: string;

  constructor() {
    this.currentUserId = this.generateUserId();
  }

  connect(): void {
    console.log('🔌 Connecting to WebSocket...');

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(this.wsUrl) as any,
      
      debug: (str: any) => {
        console.log('STOMP:', str);
      },
      
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        console.log('✅ WebSocket connected!');
        this.connectionStatus.next(true);
      },

      onStompError: (frame: any) => {
        console.error('❌ STOMP error:', frame);
        this.connectionStatus.next(false);
      },

      onWebSocketClose: () => {
        console.log('WebSocket closed');
        this.connectionStatus.next(false);
      }
    });

    this.stompClient.activate();
  }

  disconnect(): void {
    if (this.currentRoomId) {
      this.leaveRoom();
    }

    if (this.stompClient) {
      this.stompClient.deactivate();
      this.connectionStatus.next(false);
    }
  }

  joinRoom(roomId: string): void {
    if (!this.stompClient || !this.stompClient.connected) {
      console.error('Cannot join: Not connected');
      return;
    }

    this.currentRoomId = roomId;

    this.stompClient.subscribe(`/topic/collaboration`, (message: IMessage) => {
      const msg: CollaborationMessage = JSON.parse(message.body);
      if (msg.roomId === roomId) {
        this.messages.next(msg);
      }
    });

    const joinMessage: CollaborationMessage = {
      roomId: roomId,
      userId: this.currentUserId,
      content: '',
      operation: 'join',
      timestamp: Date.now()
    };

    this.sendMessage(joinMessage);
    console.log('✅ Joined room:', roomId);
  }

  leaveRoom(): void {
    if (!this.currentRoomId || !this.stompClient) return;

    const leaveMessage: CollaborationMessage = {
      roomId: this.currentRoomId,
      userId: this.currentUserId,
      content: '',
      operation: 'leave',
      timestamp: Date.now()
    };

    this.sendMessage(leaveMessage);
    this.currentRoomId = null;
  }

  sendMessage(message: CollaborationMessage): void {
    if (!this.stompClient || !this.stompClient.connected) {
      console.error('Cannot send: Not connected');
      return;
    }

    this.stompClient.publish({
      destination: '/app/collaborate',
      body: JSON.stringify(message)
    });
  }

  sendCodeUpdate(content: string): void {
    if (!this.currentRoomId) return;

    const updateMessage: CollaborationMessage = {
      roomId: this.currentRoomId,
      userId: this.currentUserId,
      content: content,
      operation: 'update',
      timestamp: Date.now()
    };

    this.sendMessage(updateMessage);
  }

  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus.asObservable();
  }

  getMessages(): Observable<CollaborationMessage | null> {
    return this.messages.asObservable();
  }

  getUserId(): string {
    return this.currentUserId;
  }

  private generateUserId(): string {
    return `user_${Math.random().toString(36).substr(2, 9)}`;
  }
}