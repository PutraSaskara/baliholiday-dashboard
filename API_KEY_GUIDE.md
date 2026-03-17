# Panduan Penggunaan API Key (`apiKeyAuth`)

Dokumen ini menjelaskan cara menggunakan middleware `apiKeyAuth` untuk mengakses endpoint publik (seperti rute `GET`) yang telah dilindungi oleh API Key. Hal ini bertujuan agar API Anda tidak bisa diakses sembarangan oleh pihak luar selain dari website utama Anda.

## 1. Persiapan

Pastikan Anda telah memiliki API Key yang benar. API Key ini disimpan di dalam file `.env` pada project backend Anda dengan nama variabel `PUBLIC_API_KEY`.

Contoh isi di file `.env`:
```env
PUBLIC_API_KEY=1234567890abcdef1234567890abcdef
```
*(Nilai di atas harus dijaga kerahasiaannya dan disamakan antara server backend dan environment frontend).*

---

## 2. Cara Mengetes Menggunakan Postman

Ikuti langkah berikut untuk melakukan *request* ke endpoint yang dilindungi:

1. Buka aplikasi **Postman**.
2. Buat tab *Request* baru.
3. Ubah *HTTP Method* menjadi **GET**.
4. Masukkan URL endpoint yang ingin dites. Contoh: `http://localhost:5000/tours`
5. Di bawah baris URL, klik tab **Headers**.
6. Tambahkan konfigurasi berikut pada baris kosong di tabel Headers:
   - Pada kolom **Key**, ketik: `x-api-key`
   - Pada kolom **Value**, *paste* nilai API Key Anda dari file `.env` (misal: `1234567890abcdef1234567890abcdef`).
7. Klik tombol **Send**.

### 🧪 Skenario Pengetesan
Untuk memastikan keamanan berjalan lancar, cobalah 3 skenario berikut di Postman:

| Skenario | Tindakan di Postman | Ekspektasi Respons Server |
| :--- | :--- | :--- |
| **Sukses** | Header `x-api-key` diisi dengan password yang **benar**. | Status `200 OK` dan muncul data JSON (Data Tours). |
| **Tanpa API Key** | Hilangkan centang (uncheck) pada header `x-api-key` lalu Send. | Status `401 Unauthorized` dengan error: *"Akses ditolak: API Key tidak ditemukan..."* |
| **API Key Salah** | Isi `x-api-key` dengan teks **sembarangan** lalu Send. | Status `403 Forbidden` dengan error: *"Akses ditolak: API Key tidak valid"* |

---

## 3. Cara Implementasi di Frontend (React / Vue / Vanilla JS)

Saat website utama Anda ingin memanggil (Fetch) data dari API Backend ini, Anda wajib menyertakan API Key tersebut di bagian `headers`.

Contoh penggunaan menggunakan **Axios**:

```javascript
import axios from 'axios';

const fetchDataTours = async () => {
    try {
        const response = await axios.get('http://localhost:5000/tours', {
            headers: {
                'x-api-key': '1234567890abcdef1234567890abcdef' // Sangat disarankan mengambil dari .env frontend (misal process.env.NEXT_PUBLIC_API_KEY)
            }
        });
        console.log("Data berhasil diambil:", response.data);
    } catch (error) {
        console.error("Gagal mengambil data:", error.response?.data?.error || error.message);
    }
}
```