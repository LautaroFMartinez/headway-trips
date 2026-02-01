'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AdvancedPaginationProps {
  totalItems: number;
  itemsPerPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
  showItemsPerPage?: boolean;
  showJumpToPage?: boolean;
  showTotalResults?: boolean;
  syncWithURL?: boolean;
  className?: string;
}

export function AdvancedPagination({ totalItems, itemsPerPage: initialItemsPerPage = 12, currentPage: controlledCurrentPage, onPageChange, onItemsPerPageChange, itemsPerPageOptions = [12, 24, 36, 48], showItemsPerPage = true, showJumpToPage = true, showTotalResults = true, syncWithURL = true, className }: AdvancedPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get initial values from URL if sync is enabled
  const urlPage = syncWithURL ? parseInt(searchParams.get('page') || '1') : 1;
  const urlItemsPerPage = syncWithURL ? parseInt(searchParams.get('per_page') || String(initialItemsPerPage)) : initialItemsPerPage;

  const [currentPage, setCurrentPage] = useState(controlledCurrentPage || urlPage);
  const [itemsPerPage, setItemsPerPage] = useState(urlItemsPerPage);
  const [jumpToPageInput, setJumpToPageInput] = useState('');

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Sync with URL params
  useEffect(() => {
    if (syncWithURL && typeof window !== 'undefined') {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(currentPage));
      params.set('per_page', String(itemsPerPage));
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [currentPage, itemsPerPage, syncWithURL, pathname, router, searchParams]);

  // Update current page when controlled
  useEffect(() => {
    if (controlledCurrentPage !== undefined) {
      setCurrentPage(controlledCurrentPage);
    }
  }, [controlledCurrentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    onPageChange?.(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
    onItemsPerPageChange?.(newItemsPerPage);
  };

  const handleJumpToPage = () => {
    const page = parseInt(jumpToPageInput);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      handlePageChange(page);
      setJumpToPageInput('');
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      if (e.key === 'ArrowLeft' && currentPage > 1) {
        handlePageChange(currentPage - 1);
      } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
        handlePageChange(currentPage + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages]);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const showPages = 5; // Number of pages to show around current

    if (totalPages <= 7) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push('ellipsis');
      }

      // Add pages around current
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push('ellipsis');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Results info */}
      {showTotalResults && (
        <div className="text-sm text-muted-foreground text-center">
          Mostrando <span className="font-medium">{startItem}</span> a <span className="font-medium">{endItem}</span> de <span className="font-medium">{totalItems}</span> resultados
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Items per page selector */}
        {showItemsPerPage && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Mostrar:</span>
            <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {itemsPerPageOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Pagination controls */}
        <nav role="navigation" aria-label="Paginación" className="flex items-center gap-2">
          {/* First page */}
          <Button variant="outline" size="icon" onClick={() => handlePageChange(1)} disabled={currentPage === 1} aria-label="Primera página">
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          {/* Previous page */}
          <Button variant="outline" size="icon" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} aria-label="Página anterior">
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) =>
              page === 'ellipsis' ? (
                <div key={`ellipsis-${index}`} className="flex items-center justify-center w-9 h-9">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </div>
              ) : (
                <Button key={page} variant={currentPage === page ? 'default' : 'outline'} size="icon" onClick={() => handlePageChange(page)} aria-label={`Página ${page}`} aria-current={currentPage === page ? 'page' : undefined}>
                  {page}
                </Button>
              )
            )}
          </div>

          {/* Next page */}
          <Button variant="outline" size="icon" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Página siguiente">
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Last page */}
          <Button variant="outline" size="icon" onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} aria-label="Última página">
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </nav>

        {/* Jump to page */}
        {showJumpToPage && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Ir a:</span>
            <Input
              type="number"
              min={1}
              max={totalPages}
              value={jumpToPageInput}
              onChange={(e) => setJumpToPageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleJumpToPage();
                }
              }}
              placeholder={String(currentPage)}
              className="w-[80px]"
              aria-label="Número de página"
            />
            <Button variant="outline" onClick={handleJumpToPage} disabled={!jumpToPageInput}>
              Ir
            </Button>
          </div>
        )}
      </div>

      {/* Keyboard hints */}
      <div className="text-xs text-muted-foreground text-center">Usa las flechas ← → del teclado para navegar entre páginas</div>
    </div>
  );
}
