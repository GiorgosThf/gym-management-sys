import React from 'react'

interface PopupModalProps {
    title: string
    message?: string | React.JSX.Element
    isOpen: boolean
    onClose: () => void
    onConfirm?: (e: React.FormEvent) => void
    confirmText?: string
    cancelText?: string
    type?: 'error' | 'confirmation' | 'form'
    children?: React.ReactNode
}

const PopupModal: React.FC<PopupModalProps> = ({
    title,
    message,
    isOpen,
    onClose,
    onConfirm,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'confirmation',
    children,
}) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2
                    className={`text-lg font-semibold ${type === 'error' ? 'text-red-600' : 'text-gray-800'}`}
                >
                    {title}
                </h2>
                {message && <p className="mt-2 text-gray-600">{message}</p>}

                {type === 'form' ? (
                    <form onSubmit={onConfirm}>
                        <div className="mt-4">{children}</div>
                        <div className="mt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                                {cancelText}
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                {confirmText}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="mt-4 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        >
                            {cancelText}
                        </button>
                        {onConfirm && (
                            <button
                                onClick={onConfirm}
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                {confirmText}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default PopupModal
