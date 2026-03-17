'use client';

import { useEffect } from 'react';

const useWarnIfUnsavedChanges = (unsavedChanges) => {
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = ''; // Required for generic browser prompt
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [unsavedChanges]);
};

export default useWarnIfUnsavedChanges;
