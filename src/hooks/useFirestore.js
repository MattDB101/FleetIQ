import { useReducer, useEffect, useState } from 'react'
import { projectFirestore, timestamp } from "../firebase/config"

let initialState = {
    document: null,
    isPending: false,
    error: null,
    success: null,
}

const firestoreReducer = (state, action) => {
    switch(action.type) {

        case "IS_PENDING":
            return { isPending: true, document: null, sucess: false, error: null }

        case "ADDED_DOCUMENT":
            return { isPending: false, document: action.payload, success: true, error: null }

        case "DELETED_DOCUMENT":
            return { isPending: false, document: action.payload, success: true, error: null}

        case "ERROR":
            return { isPending: false, document: null, success: false, error: action.payload }

        default:
            return state;
    }
}

export const useFirestore = (collection) => {
    const [response, dispatch] = useReducer(firestoreReducer, initialState)
    const [isCancelled, setIsCancelled] = useState(false)

    const ref = projectFirestore.collection(collection)

    const  dispatchIfNotCancelled = (action) => {
        if (!isCancelled){
            dispatch(action)
        }
    }

    const addDocument = async (doc) => {
        dispatch({ type: "IS_PENDING"})
        try{
            const createdAt = timestamp.fromDate(new Date())
            const addedDocument = await ref.add({ ...doc, createdAt })
            console.log(addedDocument)
            dispatchIfNotCancelled({type: "ADDED_DOCUMENT", payload: addedDocument})
        }
        catch (err) {
            dispatchIfNotCancelled({type: "ERROR", payload: err.message})

        }
    }

    const deleteDocument = async (id) => {
        dispatch({ type:"IS_PENDING" })
        try {
            const deletedDocument= await ref.doc(id).delete()
            dispatchIfNotCancelled({type: "DELETED_DOCUMENT", payload: deletedDocument})
        }
        catch (err) {
            dispatchIfNotCancelled({type: "ERROR", payload: "Failed to delete row(s)."})
        }
    }

    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return {addDocument, deleteDocument, response }
}
