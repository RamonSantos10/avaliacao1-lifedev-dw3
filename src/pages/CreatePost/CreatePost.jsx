import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthValue } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Link2, Tag, AlertCircle, Loader, X } from "lucide-react";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const formRef = useRef(null);

  const { user } = useAuthValue();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);

    try {
      // Validar URL da imagem
      try {
        new URL(image);
      } catch (error) {
        setFormError("A imagem precisa ser uma URL válida.");
        setLoading(false);
        return;
      }

      // Criar array de tags
      const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase());

      // Checar todos os valores
      if (!title || !image || !body || !tags) {
        setFormError("Por favor, preencha todos os campos!");
        setLoading(false);
        return;
      }

      // Criar objeto do post
      const post = {
        title,
        image,
        body,
        tags: tagsArray,
        uid: user.uid,
        createdBy: user.displayName,
        // Usar serverTimestamp para garantir consistência
        createdAt: serverTimestamp(),
      };

      console.log("Enviando post:", post);

      // Adicionar diretamente ao Firestore
      const docRef = await addDoc(collection(db, "posts"), post);
      console.log("Post criado com ID:", docRef.id);

      // Redirecionar para o dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao criar post:", error);
      setFormError("Erro ao criar post: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setImage("");
    setBody("");
    setTags("");
    setFormError("");
  };

  const renderTagPills = () => {
    if (!tags) return null;

    return tags.split(",").map((tag, index) => {
      const trimmedTag = tag.trim();
      if (!trimmedTag) return null;

      return (
        <span
          key={index}
          className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
        >
          #{trimmedTag}
        </span>
      );
    });
  };

  return (
    <div className="mx-auto px-6 py-8 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="container">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3">
            Criar novo post
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Escreva sobre o que quiser e compartilhe o seu conhecimento!
          </p>
        </div>
        {/* Tabs for Edit/Preview */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex -mb-px ">
            <button
              onClick={() => setPreviewMode(false)}
              className={`mr-4 py-3 px-6 font-medium text-base ${
                !previewMode
                  ? "border-b-2 border-gray-900 text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Editar
            </button>
            <button
              onClick={() => setPreviewMode(true)}
              className={`py-2 px-4 font-medium text-sm rounded-t-2xl ${
                previewMode
                  ? "border-b-2 border-gray-900 text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              disabled={!title && !image && !body && !tags}
            >
              Pré-visualizar
            </button>
          </div>
        </div>

        {previewMode ? (
          <div className="rounded-lg border border-gray-300 bg-white p-8 shadow-sm">
            {/* Preview Header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                  <img
                    src={
                      user?.photoURL ||
                      `https://ui-avatars.com/api/?name=${
                        user?.displayName || "User"
                      }&background=random`
                    }
                    alt={user?.displayName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <p className="font-medium">{user?.displayName}</p>
                  <p className="text-xs text-gray-500">Agora</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewMode(false)}
                className="rounded-md px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100"
              >
                Voltar para edição
              </button>
            </div>

            {/* Preview Image */}
            {image && (
              <div className="mb-4 overflow-hidden rounded-lg">
                <img
                  src={image || "/placeholder.svg"}
                  alt={title}
                  className="h-64 w-full object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg";
                    e.target.onerror = null;
                  }}
                />
              </div>
            )}

            {/* Preview Content */}
            <h1 className="mb-4 text-2xl font-bold">
              {title || "Título do post"}
            </h1>
            <div className="mb-6 whitespace-pre-wrap text-gray-700">
              {body || "Conteúdo do post..."}
            </div>

            {/* Preview Tags */}
            {tags && (
              <div className="flex flex-wrap gap-2">{renderTagPills()}</div>
            )}
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-6 rounded-xl border border-gray-200 bg-white p-8 shadow-lg"
          >
            {/* Error message */}
            {formError && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle
                      className="h-5 w-5 text-red-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Erro ao criar post
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{formError}</p>
                    </div>
                  </div>
                  <div className="ml-auto pl-3">
                    <div className="-mx-1.5 -my-1.5">
                      <button
                        type="button"
                        onClick={() => setFormError("")}
                        className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100"
                      >
                        <span className="sr-only">Fechar</span>
                        <X className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Title field */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-800 mb-1"
              >
                Título
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  placeholder="Um título cativante para seu post..."
                  className="p-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                />
              </div>
            </div>

            {/* Image URL field */}
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-semibold text-gray-800 mb-1"
              >
                URL da imagem
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                  <Link2 className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  name="image"
                  id="image"
                  required
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="p-2 block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                  onChange={(e) => setImage(e.target.value)}
                  value={image}
                />
              </div>
              {image && (
                <div className="mt-2 flex items-center">
                  <div className="h-16 w-16 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={image || "/placeholder.svg"}
                      alt="Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg";
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                  <span className="ml-2 text-xs text-gray-500">
                    Pré-visualização da imagem
                  </span>
                </div>
              )}
            </div>

            {/* Content field */}
            <div>
              <label
                htmlFor="body"
                className="block text-sm font-semibold text-gray-800 mb-1"
              >
                Conteúdo
              </label>
              <div className="mt-1">
                <textarea
                  id="body"
                  name="body"
                  rows={8}
                  required
                  placeholder="Compartilhe seus pensamentos, experiências ou conhecimentos..."
                  className="p-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                  onChange={(e) => setBody(e.target.value)}
                  value={body}
                ></textarea>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {body.length} caracteres | Tempo estimado de leitura:{" "}
                {Math.max(1, Math.ceil(body.split(/\s+/).length / 200))} min
              </p>
            </div>

            {/* Tags field */}
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-semibold text-gray-800 mb-1"
              >
                Tags
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                  <Tag className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  name="tags"
                  id="tags"
                  required
                  placeholder="javascript, react, webdev"
                  className="p-2 block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                  onChange={(e) => setTags(e.target.value)}
                  value={tags}
                />
              </div>
              {tags && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {renderTagPills()}
                </div>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Separe as tags por vírgulas
              </p>
            </div>

            {/* Form actions */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-150 ease-in-out"
              >
                Limpar
              </button>
              {!loading ? (
                <button
                  type="submit"
                  className="rounded-lg bg-[#101828] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-150 ease-in-out"
                >
                  Publicar post
                </button>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center rounded-md bg-gray-400 px-4 py-2 text-sm font-medium text-white shadow-sm"
                >
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Publicando...
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreatePost;
