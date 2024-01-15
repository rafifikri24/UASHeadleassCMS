'use client'
import { useState, useEffect } from "react";
import axios from 'axios';
import { useRouter } from 'next/navigation'
import Modal from "react-modal";

interface Produk {
  id: number;
  attributes: {
   NamaBarang: string;
    JenisBarang: string;
    StokBarang: number;
    HargaBarang: number;
    Suplyer:string;
  };
}

async function getData(): Promise<Produk[]> {
  try {
    const response = await axios.get('http://localhost:1337/api/produks');
    return response.data.data as Produk[];
  } catch (error) {
    throw new Error("Gagal Mendapat Data");
  }
}

export default function Home() {
  const router = useRouter()
  const [data, setData] = useState<Produk[]>([]);
  const [selectedProduk, setSelectedProduk] = useState<Produk | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [newProduk, setNewProduk] = useState({
    NamaBarang: "",
    JenisBarang: "",
    StokBarang: 0,
    HargaBarang: 0,
    Suplyer:""
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedData = await getData();
        setData(fetchedData || []);
        console.log(data)
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchData();
  }, []);

  const handleShow = (produk: Produk) => {
    setSelectedProduk(produk);
    setModalIsOpen(true);
  };
  const handleCreate = () => {
    setAddModalIsOpen(true)
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduk((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:1337/api/produks', {
        data: newProduk
      });
      window.location.reload();
    } catch (error) {
      console.error('Error adding Produk:', error);
    }
  };

  const handleEdit = () => {
    router.push('/fetch');
  };
  

  const handleDelete = async (produk: Produk) => {
    const userConfirmed = window.confirm(`Deleting Produk: ${produk.attributes.NamaBarang} - ${produk.attributes.JenisBarang}`);
    if (userConfirmed) {
    try {
      // Implement your delete logic here
      await axios.delete(`http://localhost:1337/api/produks/${produk.id}`);
      // Fetch updated data after deletion
      const updatedData = await getData();
      setData(updatedData || []);
    } catch (error) {
      console.error('Error deleting Mahasiswa:', error);
    }
  } else{
    window.location.reload();
  }
};


  const closeModal = () => {
    setSelectedProduk(null);
    setModalIsOpen(false);
  };

  return (
    <>
      <h1 style={{ color: "blue" }}>Tabel Data Produk</h1>
      <button className="btn btn-green" onClick={() => handleCreate()}>Tambah</button>
      
          <table className="table">
            
            
            <thead>
          <tr>
            <th>NO</th>
            <th>Nama Barang</th>
            <th>Jenis Barang</th>
            <th>Stok</th>
            <th>Harga</th>
            <th>Suplier</th>
          </tr>
        </thead>
        
        <tbody>
        {data.map((produk) => (
          <tr key={produk.id}>
          <td>{produk.id}</td>
          <td>{produk.attributes.NamaBarang}</td>
          <td>{produk.attributes.JenisBarang}</td>
          <td>{produk.attributes.StokBarang}</td>
          <td>{produk.attributes.HargaBarang}</td>
          <td>{produk.attributes.Suplyer}</td>
          <td>
              <button className="btn btn-blue" onClick={() => handleShow(produk)}>Detail</button>
              <button className="btn btn-yellow" onClick={() => router.push(`/page/edit/${produk.id}`)}>Edit</button>
              <button className="btn btn-red" onClick={() => handleDelete(produk)}>Hapus</button>
            </td>
          </tr>
                ))}
        </tbody>
      </table>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Detail Mahasiswa">

        {selectedProduk && (
        <div>
            <h2>Detail Produk</h2>
            <p>Nama Barang: {selectedProduk.attributes.NamaBarang}</p>
            <p>Jenis Barang: {selectedProduk.attributes.JenisBarang}</p>
            <p>Stok Barang: {selectedProduk.attributes.StokBarang}</p>
            <p>Harga Barang: {selectedProduk.attributes.HargaBarang}</p>
            <p>Suplier: {selectedProduk.attributes.Suplyer}</p>
            <button className="btn btn-red" onClick={closeModal}>Tutup</button>
        </div>
        )}
      </Modal>

      <Modal
        isOpen={addModalIsOpen}
        onRequestClose={() => setAddModalIsOpen(false)}
        contentLabel="Form Tambah Barang">
        <div>
            <h2>Edit Produk</h2>
            <form>
              <label>
                Nama Barang:
                <input style={{backgroundColor:"#787878"}} type="text" name="NamaBarang" onChange={handleInputChange} />
              </label>
              <br />
              <label>
                Jenis Barang:
                <input style={{backgroundColor:"#787878"}} type="text" name="JenisBarang" onChange={handleInputChange} />
              </label>
              <br />
              <label>
                Stok Barang:
                <input style={{backgroundColor:"#787878"}} type="text" name="StokBarang" onChange={handleInputChange} />
              </label>
              <br />
              <label>
                Harga Barang:
                <input style={{backgroundColor:"#787878"}} type="text" name="HargaBarang" onChange={handleInputChange} />
              </label>
              <br />
              <label>
                Suplyer:
                <input style={{backgroundColor:"#787878"}} type="text" name="Suplyer" onChange={handleInputChange} />
              </label>
              <br />
              <button type="button" className="btn btn-green" onClick={handleAddSubmit}>Simpan</button>
              <button type="button" className="btn btn-red" onClick={() => setUpdateModalIsOpen(false)}>Batal</button>
            </form>
          </div>
      </Modal>

    </>
  );
}