import './Pagination.css'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export function PaginationControls({ currentPage, setCurrentPage, totalPages }) {
    const goToNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1)
            console.log('Next Page:', currentPage + 1)
        }
    }

    const goToPreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1)
            console.log('Previous Page:', currentPage - 1)
        }
    }

    return (
        <div className="pagination-controls">
            <button
                onClick={goToPreviousPage}
                disabled={currentPage === 0} // Disable if it's the first page
            >
                Previous
            </button>
            <span>
                Page {currentPage + 1} of {totalPages}
            </span>{' '}
            {/* Display current page and total pages */}
            <button
                onClick={goToNextPage}
                disabled={currentPage >= totalPages - 1} // Disable if it's the last page
            >
                Next
            </button>
        </div>
    )
}
