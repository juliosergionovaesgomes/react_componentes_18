import { useMutation, useQuery, useQueryClient } from "react-query";
import User from "./model/user";
import UserService from "./serivces/user.services";
import { useState } from "react";

const App = (): JSX.Element => {
  const [name, setName] = useState<string>("");
  const [errorName, setErrorName] = useState("hidden");
  const userService = new UserService();

  // Queries
  const { isLoading, error, data } = useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: () => userService.getUsers(),
  });

  //Mutations
  const queryClient = useQueryClient();

  const mutation = useMutation<User, Error, { name: string }>({
    mutationFn: async () => await userService.createUser(name),
    onSuccess: () => {
      queryClient.invalidateQueries("users");
    },
  });

  console.log(mutation);

  if (isLoading || mutation.isLoading)
    return (
      <div>
        <h1> 'Carregando...'</h1>
      </div>
    );

  if (error || mutation.error)
    return (
      <div>
        <h1>
          `Ocorreu um erro: ${error?.message || mutation.error?.message} `;
        </h1>
      </div>
    );

  const sendNameRegitration = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    // Para validações mais complexas podem usar Zod, ou libs de validações de dados juntamente
    // com o useForm do React
    if (name === "") {
      setErrorName("");
      return;
    }

    await mutation.mutateAsync({ name: name }).then((result) => {
      console.log(result);
    });
  };

  return (
    <div className="flex items-center justify-center w-full h-screen gap-4">
      {/* Table */}
      <table className="text-white border">
        <thead className="border-2 bg-emerald-600">
          <tr>
            <td className="px-2 border">id</td>
            <td className="px-2 border">nome</td>
          </tr>
        </thead>
        <tbody className="text-white bg-neutral-800">
          {data?.map((user: User, index: number) => (
            <tr key={index}>
              {Object.keys(user).map((keys: string) => (
                <td className="border border-neutral-400" key={keys}>
                  {user[`${keys === "id" ? "id" : "name"}`]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Fim Table */}

      {/* Form */}

      <form className="flex flex-col items-center justify-center w-full max-w-sm px-4 py-8 space-y-8 text-center h-2/5 card">
        <h1 className="text-2xl font-bold text-zinc-700">
          Cadastre um novo usuário
        </h1>
        <div className="flex flex-col items-start leading-2">
          <input
            className="px-2 py-1 border rounded-md text-normal text-zinc-500"
            type="text"
            placeholder="Insira o nome"
            onChange={(e) => {
              setName(e.target.value);
              if (e.target.value === "") {
                setErrorName("");
              } else {
                setErrorName("hidden");
              }
            }}
          />
          <span
            className={`${
              errorName === "hidden" ? "hidden" : ""
            } pl-2 text-xs text-red-600`}
          >
            Nome é obrigatório
          </span>
        </div>
        <button
          onClick={sendNameRegitration}
          className="px-3 py-2 mt-12 font-bold border rounded-md shadow-sm bg-emerald-400 hover:bg-emerald-300"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
};

export default App;
