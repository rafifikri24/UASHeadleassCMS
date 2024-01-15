
'use client'
import { useEffect, useState} from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface EditPageProps {
  params: {
    slug: string;
  }
}

interface Produk {
  id: number;
  attributes: {
    NamaBarang: string;
    JenisBarang: string;
    StokBarang: number;
    HargaBarang: number;
    Supplier: string;
  };
}

const EditProdukPage = ({ params }: EditPageProps) => {
  const router = useRouter();
  const id = params.slug
  const [formData, setFormData] = useState({
    NamaBarang: "",
    JenisBarang: "",
    StokBarang: 0,
    HargaBarang: 0,
    Supplier: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {       
          const response = await axios.get(`http://localhost:1337/api/produks/${id}`);
          const produkData = response.data.data as Produk;
          setFormData({

            NamaBarang: produkData.attributes.NamaBarang,
            JenisBarang: produkData.attributes.JenisBarang,
            StokBarang: produkData.attributes.StokBarang,
            HargaBarang: produkData.attributes.HargaBarang,
            Supplier: produkData.attributes.Supplier
          });
        }
      } catch (error) {
        console.error('Error fetching Produk:', error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

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
      await axios.put(`http://localhost:1337/api/produks/${id}`, {
        data: formData,
      });
      
      router.push('/fetch');
    } catch (error) {
      console.error('Error updating Produk:', error);
    }
  };

  return (
    <div>
      <h1>Edit Produk</h1>
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
            <td>Supplier</td>
            <td><input type="text" name="Supplier" value={formData.Supplier} onChange={handleChange} /></td>
          </tr>
        </table>
        <button className="btn btn-green" type="submit">Update Produk</button>
      </form>
      <button className="btn btn-yellow" onClick={() => router.push(`/fetch`)}>Kembali</button>
    </div>
  );
};

export default EditProdukPage;
