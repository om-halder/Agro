import { db, auth } from '../auth/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

export const sendMessage = async (groupId, messageData) => {
  if (!auth.currentUser) {
    throw new Error('User not authenticated');
  }

  try {
    // Try to send to Firestore with a longer timeout
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Send message timeout - using local mode')), 15000)
    );

    const sendPromise = addDoc(collection(db, 'groups', groupId, 'messages'), {
      ...messageData,
      createdAt: serverTimestamp(),
    });

    await Promise.race([sendPromise, timeout]);
  } catch (error) {
    console.warn('Firestore send failed, continuing with local mode:', error.message);
    // Don't throw error - let the local message stay
    // This allows the chat to work even without Firestore
  }
};

export const getMessages = (groupId, callback) => {
  try {
    const messagesRef = collection(db, 'groups', groupId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    return onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      callback(messages);
    }, (error) => {
      console.warn('Error getting messages from Firestore, using local mode:', error.message);
      // Don't call callback with empty array to avoid clearing local messages
    });
  } catch (error) {
    console.warn('Failed to set up Firestore listener, using local mode:', error.message);
    // Return a dummy unsubscribe function
    return () => {};
  }
};