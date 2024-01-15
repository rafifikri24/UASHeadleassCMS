'use client'
import { useState } from 'react';
import axios from 'axios';
import Router from 'next/router';
import { useRouter } from "next/navigation";

const AddProdukPage = () => {
  const [formData, setFormData] = useState({
    NamaBarang: "",
    JenisBarang: "",
    StokBarang: 0,
    HargaBarang: 0,
    Supplier: "",
  });

  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:1337/api/produks', {
        data: formData,
      });
      
      Router.push('/fetch');
    } catch (error) {
      console.error('Error adding Produk:', error);
    }
  };

  return (
    <div>
      <h1>Add Produk</h1>
      <form onSubmit={handleSubmit}>
        <table>
          <tr>
            <td>Nama Barang</td>
            <td><input type="text" name="NamaBarang" value={formData.NamaBarang} onChange={handleChange} /></td>
          </tr>
          <tr>
            <td>Jenis Barang</td>
            <td><input type="text" name="JenisBarang" value={formData.JenisBarang} onChange={handleChange} /></td>
          </tr>
          <tr>
            <td>Stok Barang</td>
            <td><input type="text" name="StokBarang" value={formData.StokBarang} onChange={handleChange} /></td>
          </tr>
          <tr>
            <td>Harga Barang</td>
            <td><input type="text" name="HargaBarang" value={formData.HargaBarang} onChange={handleChange} /></td>
          </tr>
          <tr>
            <td>Suppiler</td>
            <td><input type="text" name="Supplier" value={formData.Supplier} onChange={handleChange} /></td>
          </tr>
        </table>
        <button className="btn btn-green" type="submit">Tambah Produk</button>
      </form>
      <button className="btn btn-yellow" onClick={() => router.push(`/fetch`)}>Kembali</button>
    </div>
  );
};

export default AddProdukPage;