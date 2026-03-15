# Panduan Penggunaan Zustand Stores

Folder `stores/` ini berisi implementasi global state management menggunakan **Zustand**. Tujuannya adalah untuk memusatkan *data fetching* (API calls), state `loading`, `error`, serta data utama agar dapat diakses oleh komponen mana saja tanpa perlu mengulangi *boilerplate* kode yang sama.

Terdapat 5 Store utama:
1. `useAuthStore` (Login, Logout, Check Auth)
2. `useTourStore` (CRUD Tour Packages)
3. `useArticleStore` (CRUD Blog Articles)
4. `useAreaStore` (CRUD Pickup Areas + Pagination & Search)
5. `useDestinationStore` (CRUD Destinations + Pagination & Search)

---

## Cara Penggunaan Dasar

Untuk menggunakan data atau fungsi dari store, panggil *hook* store tersebut di dalam komponen React Anda. Anda bisa mengambil persis apa yang Anda butuhkan (destructuring).

### 1. Mengambil Data List (Contoh: Tours)

Zustand menyimpan data di memori. Jika komponen dirender, ia bisa menggunakan tipe data yang sudah ada atau memanggil fungsi *fetch*.

```jsx
import { useEffect } from 'react';
import useTourStore from '@/stores/useTourStore';

export default function MyComponent() {
  // Hanya ambil state & fungsi yang diperlukan
  const { tours, loading, error, fetchTours } = useTourStore();

  useEffect(() => {
    fetchTours(); // Panggil API dari store
  }, [fetchTours]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <ul>
      {tours.map(tour => <li key={tour.id}>{tour.title}</li>)}
    </ul>
  );
}
```

### 2. Melakukan Aksi (Create/Update/Delete)

Keuntungan utama Zustand di sini adalah ketika Anda menghapus (Delete) atau mengedit, Anda tidak perlu mengambil ulang data dari server. Local state otomatis diperbarui.

```jsx
import useTourStore from '@/stores/useTourStore';

export default function ActionComponent({ tourId }) {
  const { deleteTour } = useTourStore();

  const handleDelete = async () => {
    if (window.confirm("Yakin hapus?")) {
      const success = await deleteTour(tourId); // Panggil API delete
      if (success) alert("Terhapus!");
    }
  };

  return <button onClick={handleDelete}>Delete Tour</button>;
}
```

### 3. Pagination & Search (Contoh: Areas / Destinations)

Untuk domain dengan paginasi, store sudah menyediakan fungsi tambahan `search` dan parameter `page`.

```jsx
import useAreaStore from '@/stores/useAreaStore';
import { useEffect, useState } from 'react';

export default function SearchArea() {
  const { areas, totalPages, currentPage, fetchAreas, searchAreas, loading } = useAreaStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchAreas(1); // Ambil halaman pertama
  }, [fetchAreas]);

  const handleSearch = (e) => {
    e.preventDefault();
    searchAreas(query); // Akan otomatis mengubah isi 'areas' di store
  };

  return (
    <form onSubmit={handleSearch}>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <button type="submit">Cari</button>
      
      {/* Tombol Page */}
      <button onClick={() => fetchAreas(currentPage + 1)}>Next Page</button>
    </form>
  );
}
```

### 4. Auth Store (Login / Logout / Check)

AuthStore menggantikan React Context `AuthContext.jsx`.

```jsx
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/useAuthStore';

export default function ProtectedComponent() {
  const { isAuthenticated, checkAuth, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === null) {
      checkAuth();
    } else if (isAuthenticated === false) {
      router.push('/login');
    }
  }, [isAuthenticated, checkAuth, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return <button onClick={handleLogout}>Keluar</button>;
}
```

---

## Apa yang sebaiknya TETAP Local State (`useState`)?

Jangan masukkan hal-hal berikut ke dalam file `use___Store.js`:
- Nilai input text dari Form (seperti *search input*, atau data formulir sebelum disubmit).
- Konfirmasi file Image/Preview Image.
- State tampilan (*UI state*) seperti pop-up modal terbuka/tertutup, *current active tab*, dsb.

Hanya simpan state yang merupakan *Single Source of Truth* dari Database (Entitas Data Utama).
