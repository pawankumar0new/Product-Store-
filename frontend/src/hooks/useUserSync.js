import { useEffect, useRef } from 'react';
import { useAuth, useUser } from '@clerk/react';
import { useMutation } from '@tanstack/react-query';
import { syncUser } from '../lib/api';

function useUserSync() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const { mutate: syncUserMutation, isPending, isSuccess, isError } = useMutation({
    mutationFn: syncUser,
  });

  const hasAttempted = useRef(false); // track if we've already tried

  useEffect(() => {
    if (isSignedIn && user && !isPending && !isSuccess && !isError && !hasAttempted.current) {
      hasAttempted.current = true;   // prevent further attempts
      syncUserMutation({
        email: user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress,
        name: user.fullName || user.firstName,
        imageUrl: user.imageUrl,
      });
    }
    // Reset attempt flag if user changes or signs out? Maybe not needed.
    // If you want to allow retry after a failure, you can reset hasAttempted on error.
  }, [isSignedIn, user, isPending, isSuccess, isError, syncUserMutation]);

  return { isSynced: isSuccess };
}

export default useUserSync;