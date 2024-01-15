'use client'
import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useRouter } from "next/navigation";
import Link from "next/link";


interface Produk {
    id: number;
    attributes: {
        NamaBarang: string;
        JenisBarang: string;
        StokBarang: number;
        HargaBarang: number;
        Supplier: string;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
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

export default function Page() {
    const router = useRouter()
    const [data, setData] = useState<Produk[]>([]);
    const [selectedProduk, setselectedProduk] = useState<Produk | null>(null);
    const [modalIsopen, setModalIsopen] = useState(false)

    useEffect(() => {
        async function fetchData() {
            try {
                const fetchedData = await getData();
                setData(fetchedData || []);
            } catch (error) {
                console.error('Error:', error);
            }
        }
        fetchData();
    }, []);

    //Detail Produk
    const handleShow = (produk: Produk) => {
        // <Link href="/addMahasiswa">Fetch</Link>
        // alert(`Showing Mahasiswa: ${mahasiswa.attributes.nim} - ${mahasiswa.attributes.nama}`);
        setselectedProduk(produk);
        setModalIsopen(true);
    };

    const handleDelete = async (produk: Produk) => {
        // alert(`Deleting Produk: ${produk.attributes.NamaBarang} - ${produk.attributes.JenisBarang}`);
        const deleted = window.confirm(`Apakah anda yakin menghapus ${produk.attributes.NamaBarang} - ${produk.attributes.JenisBarang}`);
        if (deleted) {
            try {
                await axios.delete(`http://localhost:1337/api/produks/${produk.id}`);
                const updatedData = await getData();
                setData(updatedData || []);
              } catch (error) {
                console.error('Error deleting Produk:', error);
              }
            } else {
                window.location.reload();
            }
        }

    const closeModal = () => {
        setselectedProduk(null);
        setModalIsopen(false);
      };
    return (
        <main>
            <h1 className="color=blue">Daftar Produk</h1>
            <button className="btn btn-green" onClick={() => router.push(`/fetch/addproduk`)}>Tambah Data</button>
            <table className="table-auto border-collapse border-2 border-gray-500">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama Barang</th>
                        <th>Jenis</th>
                        <th>Stok</th>
                        <th>Harga</th>
                        <th>Supplier</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item,index) =>(
                        <tr key={index}>
                            <td>{index+1}</td>
                            <td>{item.attributes.NamaBarang}</td>
                            <td>{item.attributes.JenisBarang}</td>
                            <td>{item.attributes.StokBarang}</td>
                            <td>{item.attributes.HargaBarang}</td>
                            <td>{item.attributes.Supplier}</td>
                            <td>
                                <button className="btn btn-blue" onClick={() => handleShow(item)}>Show</button>
                                <button className="btn btn-yellow" onClick={() => router.push(`/fetch/editproduk/${item.id}`)}>Edit</button>
                                <button className="btn btn-red" onClick={() => handleDelete(item)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal
                isOpen={modalIsopen}
                onRequestClose={closeModal}
                contentLabel="Detail Produk"
            >
                {selectedProduk && (
                <div>
                    <h2>Produk Details</h2>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>Nama Barang</th>
                                <th>Jenis</th>
                                <th>Stok</th>
                                <th>Harga</th>
                                <th>Supplier</th>
                                <th>Tanggal</th>
                                <th>Update</th>
                                <th>Publish</th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{selectedProduk.attributes.NamaBarang}</td>
                                <td>{selectedProduk.attributes.JenisBarang}</td>
                                <td>{selectedProduk.attributes.StokBarang}</td>
                                <td>{selectedProduk.attributes.HargaBarang}</td>
                                <td>{selectedProduk.attributes.Supplier}</td>
                                <td>{selectedProduk.attributes.createdAt}</td>
                                <td>{selectedProduk.attributes.updatedAt}</td>
                                <td>{selectedProduk.attributes.publishedAt}</td>
                            </tr>
                        </tbody>
                    </table>
                    <button className="btn btn-red" onClick={closeModal}>Tutup</button>
                </div>
                
                )}
            </Modal>

        </main>
    )
}