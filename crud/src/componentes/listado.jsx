import React, { useEffect, useState } from "react";
import axios from 'axios';
import { alertaSucess, alertaError, alertaWarning } from "../funtion";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import '../Usu.css';


export const Listado = () => {

    const url = 'https://api.escuelajs.co/api/v1/categories';
    const [usuarios, setUsuarios] = useState([]);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('');
    const [titleModal, setTitleModal] = useState('');
    const [operation, setOperation] = useState(1);

    const getUsuarios = async () => {
        try {
            const response = await axios.get(url);
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            alert('Error al obtener usuarios');
        }
    };

    useEffect(() => {
        getUsuarios();
    }, []);

    const openModal = (operation, id, name,  avatar) => {
        setId(id);
        setName(name);
        setAvatar(avatar);

        if (operation === 1) {
            setTitleModal('Registrar Usuario');
            setOperation(1);
        } else if (operation === 2) {
            setTitleModal('Editar Usuario');
            setOperation(2);
        }
    };

    const enviarSolicitud = async (url, metodo, parametros) => {
        let obj = {
            method: metodo,
            url: url,
            data: parametros,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };
        await axios(obj).then(() => {
            let mensaje;

            if (metodo === 'POST') {
                mensaje = 'Se guardó el usuario';
            } else if (metodo === 'PUT') {
                mensaje = 'Se editó el usuario';
            } else if (metodo === 'DELETE') {
                mensaje = 'Se eliminó el usuario';
            }
            alertaSucess(mensaje);
            document.getElementById('btnCerrarModal').click();
            getUsuarios();
        }).catch((error) => {
            alertaError(error.response.data.message);
            console.log(error);
        });
    }

    const validar = () => {
        if (!name || !avatar ) {
            alertaWarning('Por favor, complete todos los campos');
            return;
        }

        let payload = {
            name: name,
            avatar: avatar,
        };

        let metodo, urlAxios;
        if (operation === 1) {
            metodo = 'POST';
            urlAxios = url;
        } else {
            metodo = 'PUT';
            urlAxios = `${url}/${id}`;
        }

        enviarSolicitud(urlAxios, metodo, payload);
    };

    const deleteUsuario = (id) => {
        const urlDelete = `${url}/${id}`;

        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: '¿Está seguro de eliminar el usuario?',
            icon: 'question',
            text: 'El usuario se eliminará de forma permanente?',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setId(id);
                enviarSolicitud(urlDelete, 'DELETE', {});
            }
        }).catch((error) => {
            console.error('Error al eliminar usuario:', error);
            alert('Error al eliminar usuario');
        });
    };

    return (
        <div className='App '>
            <div className='container-fluid mt-5'>
                <h2> Listado de Categorias</h2>
                <div className='row mt-3'>
                    <div className='col-md-4 offset-md-4'>
                        <div className='d-grid mx-auto'>
                            <button onClick={() => openModal(1)} className='btn btn-dark btn-sm btn-block' data-bs-toggle='modal' data-bs-target='#modalUsuarios'>
                                <i className='fa-solid fa-circle-plus' /> Añadir
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className='row mt-3'>
                <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                    <div className='table-responsive'>
                        <table className='table table-striped'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Imagen</th>
                                    <th>Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    usuarios.map((usuario, index) => (
                                        <tr key={usuario.id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <img 
                                                    src={usuario.avatar ? usuario.avatar : 'https://i.imgur.com/ZANVnHE.jpeg'} 
                                                    alt='Avatar' 
                                                    className='avatar' 
                                                />
                                            </td>
                                            <td>{usuario.name}</td>
                                            <td>
                                                <span 
                                                    onClick={() => openModal(2, usuario.id, usuario.name, usuario.avatar)} 
                                                    className='btn badge btn-warning' 
                                                    data-bs-toggle='modal' 
                                                    data-bs-target='#modalUsuarios'
                                                >
                                                    Editar
                                                </span>
                                                <span 
                                                    onClick={() => deleteUsuario(usuario.id)} 
                                                    className='btn badge btn-danger'
                                                >
                                                    Eliminar
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div id='modalUsuarios' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title'>{titleModal}</h5>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                        </div>
                        <div className='modal-body'>
                            <input type='hidden' id='id' />
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-user'></i></span>
                                <input type='text' id='name' className='form-control' placeholder='Nombre' value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                           
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-image'></i></span>
                                <input type='text' id='avatar' className='form-control' placeholder='URL de Avatar' value={avatar} onChange={(e) => setAvatar(e.target.value)} />
                            </div>
                          
                        </div>
                        <div className='modal-footer'>
                            <span onClick={() => validar()} className='btn badge btn-success'>
                                <i className='fa-solid fa-save'></i> Keep
                            </span>
                            <span id='btnCerrarModal' type='button' className='btn badge btn-secondary' data-bs-dismiss='modal'>
                                Close
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
