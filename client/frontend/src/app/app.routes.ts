

import { Routes } from '@angular/router';
import { EditorComponent } from './components/editor/editor';

export const routes: Routes = [
  { path: '', component: EditorComponent },
  { path: '**', redirectTo: '' }
];