import { useEffect, useState } from 'react';
import { projectFirestore } from '../firebase/config';

export const useDocument = (collection, id) => {
    const [document, setDocument] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const ref = projectFirestore.collection(collection).doc(id);

        const unsubscribe = ref.onSnapshot((doc) => {
            if (doc.exists) {
                // Document exists, update state
                setDocument({ ...doc.data(), id: doc.id });
                setError(null);
            } else {
                // Document does not exist
                setDocument(null);
                setError("Document does not exist.");
            }
        }, (error) => {
            console.log(error);
            setError("Failed to get data.");
        });

        return () => unsubscribe();

    }, [collection, id]);

    return { document, error };
};
