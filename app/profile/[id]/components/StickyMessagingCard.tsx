'use client';

import { SimpleMessageButton } from './SimpleMessageButton';

interface StickyMessagingCardProps {
  housemateId: string;
  isOwnProfile: boolean;
}

export function StickyMessagingCard({ housemateId, isOwnProfile }: StickyMessagingCardProps) {
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-40 bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-gray-300 rounded-lg p-3">
              <div className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">MOVE-IN</div>
              <div className="text-sm font-medium">Flexible</div>
            </div>
            <div className="border border-gray-300 rounded-lg p-3">
              <div className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">DURATION</div>
              <div className="text-sm font-medium">Long-term</div>
            </div>
          </div>
        </div>

        {!isOwnProfile && (
          <div className="pt-6 border-t border-gray-100 space-y-4">
            <SimpleMessageButton housemateId={housemateId} />
            <div className="text-center text-sm text-gray-600">
              Message to see if you're a good fit
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 