// Botón para mostrar el formulario de respuesta dentro de la página de detalle del hilo.
interface CreateReplyButtonProps {
    onClick: () => void;
}

export function CreateReplyButton({ onClick }: CreateReplyButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="rounded-full bg-[#170fdb] px-2 py-2 text-sm font-medium text-white shadow-md shadow-[#170fdb] transition hover:bg-[#fff] hover:text-[#170fdb]"
        >
            + Responder
        </button>
    );
}