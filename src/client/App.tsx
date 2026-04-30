import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { HomeView } from './views/HomeView';
import { WorkspaceView } from './views/WorkspaceView';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HomeView />} path="/" />
        <Route element={<WorkspaceView />} path="/:noteId" />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </BrowserRouter>
  );
}
