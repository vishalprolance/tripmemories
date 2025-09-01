import React from 'react';
import TripCard from './TripCard';

const TripGrid = ({ trips, onTripManage, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)]?.map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-muted rounded-xl overflow-hidden">
              <div className="h-48 bg-muted-foreground/20" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted-foreground/20 rounded w-3/4" />
                <div className="h-3 bg-muted-foreground/20 rounded w-1/2" />
                <div className="flex justify-between">
                  <div className="h-3 bg-muted-foreground/20 rounded w-1/4" />
                  <div className="h-3 bg-muted-foreground/20 rounded w-1/4" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!trips || trips?.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trips?.map((trip) => (
        <TripCard
          key={trip?.id}
          trip={trip}
          onManage={onTripManage}
        />
      ))}
    </div>
  );
};

export default TripGrid;