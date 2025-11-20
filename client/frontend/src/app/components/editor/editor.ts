// import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ActivatedRoute } from '@angular/router';
// import { EditorView, keymap } from '@codemirror/view';
// import { EditorState } from '@codemirror/state';
// import { javascript } from '@codemirror/lang-javascript';
// import { python } from '@codemirror/lang-python';
// import { java } from '@codemirror/lang-java';
// import { autocompletion, CompletionContext, CompletionResult } from '@codemirror/autocomplete';
// import { defaultKeymap } from '@codemirror/commands';
// import { CompletionService,CompletionRequest } from '../../services/completion';
// import { CollaborationService } from '../../services/collaboration';
// import { Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
// @Component({
//   selector: 'app-editor',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './editor.html', 
//   styleUrls: ['./editor.css']
// })
// export class EditorComponent implements OnInit, OnDestroy {
  
//   @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;

//   private editorView!: EditorView;
  
//   roomId: string = 'default-room';
//   userId: string = '';
  
//   selectedLanguage: string = 'javascript';
//   availableLanguages = ['javascript', 'python', 'java'];
  
//   isConnected: boolean = false;
//   activeUsers: Set<string> = new Set();
  
//   private isRemoteChange: boolean = false;
//   private destroy$ = new Subject<void>();

//   constructor(
//     private route: ActivatedRoute,
//     private completionService: CompletionService,
//     private collaborationService: CollaborationService
//   ) {}

//   ngOnInit(): void {
//     this.route.queryParams.subscribe(params => {
//       this.roomId = params['room'] || 'default-room';
//     });

//     this.userId = this.collaborationService.getUserId();
//     this.initializeEditor();
//     this.collaborationService.connect();

//     this.collaborationService.getConnectionStatus()
//       .pipe(takeUntil(this.destroy$))
//       .subscribe(status => {
//         this.isConnected = status;
//         if (status) {
//           this.collaborationService.joinRoom(this.roomId);
//         }
//       });

//     this.collaborationService.getMessages()
//       .pipe(takeUntil(this.destroy$))
//       .subscribe(message => {
//         if (!message) return;
        
//         switch (message.operation) {
//           case 'join':
//             this.activeUsers.add(message.userId);
//             break;
//           case 'leave':
//             this.activeUsers.delete(message.userId);
//             break;
//           case 'update':
//             if (message.userId !== this.userId) {
//               this.applyRemoteUpdate(message.content);
//             }
//             break;
//         }
//       });
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//     if (this.editorView) this.editorView.destroy();
//     this.collaborationService.disconnect();
//   }

//   private initializeEditor(): void {
//     const initialContent = `// Welcome to Collaborative Code Editor!
// // Press Ctrl+Space for AI completions

// function example() {
//   console.log("Hello, World!");
// }

// `;

//     const startState = EditorState.create({
//       doc: initialContent,
//       extensions: [
//         this.getLanguageExtension(),
//         keymap.of(defaultKeymap),
//         autocompletion({
//           override: [this.aiCompletionSource.bind(this)]
//         }),
//         EditorView.updateListener.of(update => {
//           if (update.docChanged && !this.isRemoteChange) {
//             const content = update.state.doc.toString();
//             this.onEditorChange(content);
//           }
//         })
//       ]
//     });

//     this.editorView = new EditorView({
//       state: startState,
//       parent: this.editorContainer.nativeElement
//     });
//   }

//   private getLanguageExtension() {
//     switch (this.selectedLanguage) {
//       case 'javascript': return javascript();
//       case 'python': return python();
//       case 'java': return java();
//       default: return javascript();
//     }
//   }

//   private async aiCompletionSource(context: CompletionContext): Promise<CompletionResult | null> {
//     const code = context.state.doc.toString();
//     const cursorPos = context.pos;

//     if (code.trim().length === 0) return null;

//     const request: CompletionRequest = {
//       code: code,
//       cursorPosition: cursorPos,
//       language: this.selectedLanguage,
//       maxSuggestions: 5
//     };

//     try {
//       const completions = await this.completionService.getCompletions(request).toPromise();

//       if (!completions || completions.length === 0) return null;

//       const options = completions.map(completion => ({
//         label: completion.suggestion.split('\n')[0].substring(0, 50),
//         detail: completion.description,
//         info: completion.suggestion,
//         apply: completion.suggestion,
//         type: 'text',
//         boost: completion.confidence / 100
//       }));

//       return { from: cursorPos, options: options };

//     } catch (error) {
//       console.error('Error getting completions:', error);
//       return null;
//     }
//   }

//   private onEditorChange(content: string): void {
//     if (this.isConnected) {
//       this.collaborationService.sendCodeUpdate(content);
//     }
//   }

//   private applyRemoteUpdate(content: string): void {
//     if (!this.editorView || !content) return;

//     this.isRemoteChange = true;

//     try {
//       const transaction = this.editorView.state.update({
//         changes: {
//           from: 0,
//           to: this.editorView.state.doc.length,
//           insert: content
//         }
//       });
//       this.editorView.dispatch(transaction);
//     } finally {
//       this.isRemoteChange = false;
//     }
//   }

//   changeLanguage(language: string): void {
//     this.selectedLanguage = language;
//     const currentContent = this.editorView.state.doc.toString();
//     this.editorView.destroy();
//     this.initializeEditor();
    
//     const transaction = this.editorView.state.update({
//       changes: { from: 0, to: 0, insert: currentContent }
//     });
//     this.editorView.dispatch(transaction);
//   }

//   getUserCount(): number {
//     return this.activeUsers.size + 1;
//   }
// }
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EditorView, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { autocompletion, CompletionContext, CompletionResult } from '@codemirror/autocomplete';
import { defaultKeymap } from '@codemirror/commands';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editor.html',
  styleUrls: ['./editor.css']
})
export class EditorComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('editorContainer', { static: false }) editorContainer!: ElementRef;
  
  roomId: string = '';
  userId: string = '';
  selectedLanguage: string = 'javascript';
  availableLanguages: string[] = ['javascript', 'python', 'java'];
  isConnected: boolean = false;
  private activeUsers: Set<string> = new Set();
  
  private editorView?: EditorView;
  private destroy$ = new Subject<void>();
  private isBrowser: boolean;

  constructor(
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.userId = 'user_' + Math.random().toString(36).substr(2, 9);
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.roomId = params['id'] || this.generateRoomId();
      console.log('Room ID:', this.roomId);
    });

    if (this.isBrowser) {
      setTimeout(() => {
        this.isConnected = true;
        this.activeUsers.add(this.userId);
      }, 1000);
    }
  }

  ngAfterViewInit(): void {
    // Only initialize editor in browser
    if (this.isBrowser) {
      this.initializeEditor();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.editorView) {
      this.editorView.destroy();
    }
  }

  private initializeEditor(): void {
    if (!this.isBrowser || !this.editorContainer) {
      return;
    }

    const startState = EditorState.create({
      doc: this.getDefaultCode(this.selectedLanguage),
      extensions: [
        this.getLanguageExtension(this.selectedLanguage),
        keymap.of(defaultKeymap),
        autocompletion({
          override: [this.customCompletions.bind(this)]
        }),
        EditorView.lineWrapping,
        EditorView.theme({
          '&': {
            height: '100%',
            backgroundColor: '#1e1e1e'
          },
          '.cm-content': {
            caretColor: '#ffffff'
          },
          '.cm-cursor': {
            borderLeftColor: '#ffffff'
          },
          '.cm-gutters': {
            backgroundColor: '#1e1e1e',
            color: '#858585',
            border: 'none'
          },
          '.cm-activeLineGutter': {
            backgroundColor: '#2d2d2d'
          },
          '.cm-activeLine': {
            backgroundColor: '#2d2d2d'
          }
        })
      ]
    });

    this.editorView = new EditorView({
      state: startState,
      parent: this.editorContainer.nativeElement
    });
  }

  private getLanguageExtension(language: string) {
    switch (language) {
      case 'python':
        return python();
      case 'java':
        return java();
      case 'javascript':
      default:
        return javascript();
    }
  }

  private getDefaultCode(language: string): string {
    const templates: { [key: string]: string } = {
      javascript: `// Welcome to the Collaborative Code Editor!
// Start coding in JavaScript

function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`,
      
      python: `# Welcome to the Collaborative Code Editor!
# Start coding in Python

def greet(name):
    return f"Hello, {name}!"

print(greet("World"))`,
      
      java: `// Welcome to the Collaborative Code Editor!
// Start coding in Java

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
    
    public static String greet(String name) {
        return "Hello, " + name + "!";
    }
}`
    };
    
    return templates[language] || templates['javascript'];
  }

  changeLanguage(language: string): void {
    if (!this.isBrowser || !this.editorView) {
      return;
    }

    const currentCode = this.editorView.state.doc.toString();
    
    const shouldChange = currentCode.trim() === '' || 
                        currentCode === this.getDefaultCode(this.selectedLanguage) ||
                        confirm('Changing language will reset the editor. Continue?');
    
    if (shouldChange) {
      const newState = EditorState.create({
        doc: this.getDefaultCode(language),
        extensions: [
          this.getLanguageExtension(language),
          keymap.of(defaultKeymap),
          autocompletion({
            override: [this.customCompletions.bind(this)]
          }),
          EditorView.lineWrapping,
          EditorView.theme({
            '&': {
              height: '100%',
              backgroundColor: '#1e1e1e'
            },
            '.cm-content': {
              caretColor: '#ffffff'
            },
            '.cm-cursor': {
              borderLeftColor: '#ffffff'
            },
            '.cm-gutters': {
              backgroundColor: '#1e1e1e',
              color: '#858585',
              border: 'none'
            },
            '.cm-activeLineGutter': {
              backgroundColor: '#2d2d2d'
            },
            '.cm-activeLine': {
              backgroundColor: '#2d2d2d'
            }
          })
        ]
      });
      
      this.editorView.setState(newState);
    } else {
      this.selectedLanguage = this.selectedLanguage === language ? 
        this.availableLanguages[0] : this.selectedLanguage;
    }
  }

  private customCompletions(context: CompletionContext): CompletionResult | null {
    const word = context.matchBefore(/\w*/);
    if (!word || (word.from === word.to && !context.explicit)) {
      return null;
    }

    const completions = [
      { label: 'function', type: 'keyword', info: 'Define a function' },
      { label: 'const', type: 'keyword', info: 'Declare a constant' },
      { label: 'let', type: 'keyword', info: 'Declare a variable' },
      { label: 'console.log', type: 'function', info: 'Log to console' },
      { label: 'if', type: 'keyword', info: 'Conditional statement' },
      { label: 'for', type: 'keyword', info: 'For loop' },
      { label: 'return', type: 'keyword', info: 'Return a value' }
    ];

    return {
      from: word.from,
      options: completions
    };
  }

  getUserCount(): number {
    return this.activeUsers.size;
  }

  private generateRoomId(): string {
    return 'room_' + Math.random().toString(36).substr(2, 9);
  }

  getEditorContent(): string {
    return this.editorView ? this.editorView.state.doc.toString() : '';
  }
}