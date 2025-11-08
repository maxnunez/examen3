import { Routes } from '@angular/router';
// @ts-ignore
import { GalleryComponent} from './components/gallery/gallery.ts';
// @ts-ignore
import { CharacterDetailComponent } from './components/character-detail/character-detail.ts';

export const routes: Routes = [
  { path: '', component: GalleryComponent },
  { path: 'detail/:id', component: CharacterDetailComponent },
  { path: '**', redirectTo: '' }
];
