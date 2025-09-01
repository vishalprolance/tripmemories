import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import JoinTripPage from './pages/join-trip';
import MediaViewer from './pages/media-viewer';
import UploadMedia from './pages/upload-media';
import TripDashboard from './pages/trip-dashboard';
import CreateTrip from './pages/create-trip';
import TripGallery from './pages/trip-gallery';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<CreateTrip />} />
        <Route path="/join-trip" element={<JoinTripPage />} />
        <Route path="/media-viewer" element={<MediaViewer />} />
        <Route path="/upload-media" element={<UploadMedia />} />
        <Route path="/trip-dashboard" element={<TripDashboard />} />
        <Route path="/create-trip" element={<CreateTrip />} />
        <Route path="/trip-gallery" element={<TripGallery />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
