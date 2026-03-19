import { useUser } from "@/context/UserContext";
import { useState } from "react";


// Botón de acción principal para abrir el formulario de nuevo hilo.
// El estado abierto/cerrado del formulario lo gestiona el componente padre.
interface CreateThreadButtonProps {
    onClick?: () => void;
}

export function CreateThreadButton({ onClick }: CreateThreadButtonProps) {
    const { user } = useUser();
    const [error, setError] = useState<string | null>(null);

    function handleClick() {
        setError(null);

        if (!user) {
            setError('Debes iniciar sesion para crear un hilo')
            return;
        }

        if (user.role === 'guest') {
            setError('Debes crear una cuenta para crear un hilo')
            return;
        }
        // Si todo OK → abre el formulario
        onClick?.();
    }


    return (
        <button
            type="button"
            onClick={handleClick}
            className="rounded-full bg-[#170fdb] px-4 py-2 text-sm font-medium text-white shadow-md shadow-[#170fdb] transition hover:bg-[#fff] hover:text-[#170fdb]"
        >
            + Nueva Conversacion
        </button>
    );
}