import { Suspense } from 'react';
import { ChatExplorerView } from '../components/chat/chatExplorerView';
import { ChatExplorerSkeleton } from '../components/chat/chatExplorerSkeleton';
export default function ChatExplorerPage() {
  return (
    <Suspense fallback={<ChatExplorerSkeleton />}>
      <ChatExplorerView />
    </Suspense>
  );
}