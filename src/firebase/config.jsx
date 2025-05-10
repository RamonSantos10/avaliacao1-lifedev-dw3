import { initializeApp } from "firebase/app"
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore"
import { getAuth } from "firebase/auth"

// Configuração do Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Inicializa o Firebase
const app = initializeApp(firebaseConfig)

// Inicializa o Firestore e Auth
const db = getFirestore(app)
const auth = getAuth(app)

// Habilitar persistência offline (opcional)
try {
  enableIndexedDbPersistence(db)
    .then(() => {
      console.log("Persistência offline habilitada")
    })
    .catch((err) => {
      console.error("Erro ao habilitar persistência:", err)
    })
} catch (error) {
  console.log("Persistência não suportada ou já habilitada")
}

console.log("Firebase inicializado com sucesso!")

export { db, auth }
