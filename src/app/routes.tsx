import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { PageSkeleton } from '../shared/components/ui/Skeleton';
import HomePage from '../features/home/HomePage';
import { lazyWithRetry } from '../utils/lazyWithRetry';

const ProjectDetail = lazyWithRetry(() => import('../features/projects/ProjectDetailPage'), 'ProjectDetailPage');
const ProfilePage = lazyWithRetry(() => import('../features/profile/ProfilePage'), 'ProfilePage');
const BlogPage = lazyWithRetry(() => import('../features/blog/BlogPage'), 'BlogPage');
const BlogDetailPage = lazyWithRetry(() => import('../features/blog/BlogDetailPage'), 'BlogDetailPage');
const FriendsPage = lazyWithRetry(() => import('../features/friends/FriendsPage'), 'FriendsPage');
const FandomPage = lazyWithRetry(() => import('../features/fandom/FandomPage'), 'FandomPage');
const TravelPage = lazyWithRetry(() => import('../features/travel/TravelPage'), 'TravelPage');
const NotFoundPage = lazyWithRetry(() => import('../features/errors/NotFoundPage'), 'NotFoundPage');
const ServerErrorPage = lazyWithRetry(() => import('../features/errors/ServerErrorPage'), 'ServerErrorPage');

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
        <Route path="/travel" element={<TravelPage />} />
        <Route path="/500" element={<ServerErrorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
