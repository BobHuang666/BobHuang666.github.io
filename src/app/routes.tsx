import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { PageSkeleton } from '../shared/components/ui/Skeleton';
import HomePage from '../features/home/HomePage';

const ProjectDetail = lazy(() => import('../features/projects/ProjectDetailPage'));
const ProfilePage = lazy(() => import('../features/profile/ProfilePage'));
const BlogPage = lazy(() => import('../features/blog/BlogPage'));
const BlogDetailPage = lazy(() => import('../features/blog/BlogDetailPage'));
const FriendsPage = lazy(() => import('../features/friends/FriendsPage'));
const FandomPage = lazy(() => import('../features/fandom/FandomPage'));
const NotFoundPage = lazy(() => import('../features/errors/NotFoundPage'));
const ServerErrorPage = lazy(() => import('../features/errors/ServerErrorPage'));

/** Route declarations only. Keep route-level lazy loading here. */
export function AppRoutes() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/fandom" element={<FandomPage />} />
        <Route path="/500" element={<ServerErrorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
