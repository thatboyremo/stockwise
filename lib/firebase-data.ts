import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, updateDoc, where, type DocumentData } from 'firebase/firestore'
import { db, requireFirebaseConfig } from './firebase'

export type Product = { id: string; userId: string; name: string; sku: string; category: string; price: number; stock: number; reorderLevel: number; supplierId?: string }
export type Supplier = { id: string; userId: string; name: string; email: string; phone: string; company: string; address: string }
export type Sale = { id: string; userId: string; productId: string; productName: string; quantity: number; totalAmount: number; saleDate: string }
export type Purchase = { id: string; userId: string; productId: string; productName: string; quantity: number; totalCost: number; supplierId?: string; purchaseDate: string }

async function list<T>(name: string, userId: string) {
  requireFirebaseConfig()
  const snapshot = await getDocs(query(collection(db!, name), where('userId', '==', userId)))
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as T)
}
export const listProducts = (uid: string) => list<Product>('products', uid)
export const listSuppliers = (uid: string) => list<Supplier>('suppliers', uid)
export const listSales = (uid: string) => list<Sale>('sales', uid)
export const listPurchases = (uid: string) => list<Purchase>('purchases', uid)

export async function createRecord(name: string, userId: string, data: DocumentData) { requireFirebaseConfig(); return addDoc(collection(db!, name), { ...data, userId, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }) }
export async function updateRecord(name: string, id: string, data: DocumentData) { requireFirebaseConfig(); return updateDoc(doc(db!, name, id), { ...data, updatedAt: serverTimestamp() }) }
export async function deleteRecord(name: string, id: string) { requireFirebaseConfig(); return deleteDoc(doc(db!, name, id)) }

