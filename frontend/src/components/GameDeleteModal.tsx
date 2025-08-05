'use client';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Game } from '@/app/types/Game';
import { AlertTriangle } from 'lucide-react';

interface GameDeleteModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    game: Game | null;
    onConfirm: () => void;
}

export default function GameDeleteModal({
    open,
    onOpenChange,
    game,
    onConfirm,
}: GameDeleteModalProps) {
    const handleConfirm = () => {
        onConfirm();
        onOpenChange(false);
    };

    const handleCancel = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Confirm Delete
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-gray-700">
                        Are you sure you want to delete this game?
                    </p>
                    {game && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                            <p className="font-medium text-gray-900">{game.name}</p>
                            <p className="text-sm text-gray-600">ID: {game.id}</p>
                            <p className="text-sm text-gray-600">Genre: {game.genre || '—'}</p>
                            <p className="text-sm text-gray-600">Price: ${game.price.toFixed(2)}</p>
                        </div>
                    )}
                    <p className="mt-3 text-sm text-red-600">
                        This action cannot be undone.
                    </p>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleConfirm}>
                        Confirm Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}