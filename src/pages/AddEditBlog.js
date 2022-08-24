import React, { useState, useEffect } from "react";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import { useNavigate, useParams } from "react-router-dom";
import {db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { addDoc, collection, doc, serverTimestamp, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";



const initialState = {
  title: "",
  tags: [],
  trending: "no",
  category: "",
  description: "",
};

const categoryOption = [
  "Gamou",
  "Universite du ramadan",
  "Colisee de l'Eveil",
  "PUR",
  "Tarikha",
  "Divers",
];


const AddEditBlog = ({user, setActive}) => {
  const [form, setForm] = useState(initialState);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);

  const {id} = useParams();

  const navigate = useNavigate();

  const {title, tags, category, trending, description} = form;

  useEffect(() => {
    const uploadFile = () => {
      const storageRef= ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on("state_changed", (snapshot) => {
          const progress = 
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Telechargement est " + progress + "% termine");
          setProgress(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Telechargement est mise en pause");
              break;
            case "running":
              console.log("telechargement en cours");
              break;
              default:
              break;
          }
      }, (error) => {
        console.log(error)
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          toast.info("Chargement de l'image avec succes.")
          setForm((prev) => ({...prev, imgUrl: downloadUrl}))
        })
      }
      );
    };

    file && uploadFile();
  }, [file]);

  useEffect(() => {
    id && getBlogDetail();
    //eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [id]);

  const getBlogDetail = async () => {
    const docRef = doc(db, "blogs", id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      setForm({ ...snapshot.data() });
    }
    setActive(null);
  };
  

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleTags = (tags) => {
    setForm({...form, tags});
  };

  const handleTrending = (e) => {
    setForm({...form, trending: e.target.value });
  };

  const onCategoryChange = (e) => {
    setForm({...form, category: e.target.value })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(category && tags && title && description && trending) {
      if(!id) {
        try {
          await addDoc(collection(db, "blogs"), {
            ...form, 
            timestamp: serverTimestamp(), 
            author: user.displayName,
            userId: user.uid,
          });
          toast.success("Blog cree avec succes");
            }catch(err) {
            console.log(err);
          }
      }else{
        try {
          await updateDoc(doc(db, "blogs", id), {
            ...form,
            timestamp: serverTimestamp(),
            author: user.displayName,
            userId: user.uid,
          });
          toast.success("Blog mise a jour avec succes");
        } catch (err) {
          console.log(err);
        }
      }
    }else{
      return toast.error("Tous les champs sont obligatoires a remplir");
    }

    navigate("/");
  };

  return (
    <div className="container-fluid mb-4">
      <div className="container">
        <div className="col-12">
          <div className="text-center heading py-2">
              {id ? "Mise a jour du Blog" : "Creer Blog"}
          </div>
          <div className="row h-100 justify-content-center align-items-center">
              <div className="col-10 col-md-8 col-lg-6">
                <form className="row blog-form" onSubmit={handleSubmit}>
                    <div className="col-12 py-3">
                      <input
                        type="text"
                        className="form-control input-text-box"
                        placeholder="Titre"
                        name="title"
                        value={title}
                        onChange={handleChange}
                        />
                    </div>
                    <div className="col-12 py-3">
                      <ReactTagInput 
                      tags={tags} 
                      placeholder="Tags" 
                      onChange={handleTags} 
                      />
                    </div>
                    <div className="col-12 py-3">
                      <p className="trending">Est ce un blog a la une ?</p>
                      <div className="form-check-inline mx-2">
                        <input
                          type="radio"
                          className="form-check-input"
                          value="Oui"
                          name="radioOption"
                          checked={trending === "Oui"}
                          onChange={handleTrending}
                          />
                          <label htmlFor="radioOption" className="form-check-label">
                            Oui&nbsp;
                          </label>
                          <input
                            type="radio"
                            className="form-check-input"
                            value="no"
                            name="radioOption"
                            checked={trending === "no"}
                            onChange={handleChange}
                            />
                            <label htmlFor="radioOption" className="form-check-label">
                              No
                            </label>
                      </div>
                    </div>
                    <div className="col-12 py-3">
                      <select 
                      value={category} 
                      onChange={onCategoryChange} 
                      className="catg-dropdown">
                        <option>
                          Veuillez selectionner une categorie
                        </option>
                        {categoryOption.map((option, index) => (
                            <option value={option || ""} key={index}>
                              {option}
                            </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12 py-3">
                      <textarea 
                      className="form-control description-box" 
                      placeholder="Description" 
                      value={description} 
                      name="description"
                      onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3"> 
                        <input 
                          type="file" 
                          className="form-control" 
                          onChange={(e) => setFile(e.target.files[0])}
                        />
                    </div>
                    <div className="col-12 py-3 text-center">
                          <button className="btn btn-add" type="submit" disabled={progress !== null && progress < 100}>
                            {id ? "Mise a Jour" : "Soumettre"}
                          </button>
                    </div>
                </form>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddEditBlog