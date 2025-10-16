import { useRef, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Plus } from 'lucide-react';

const ModalPermission = ({ onClose, onSubmit, menus, permissions }) => {
    const formRef = useRef(null);
    const [selectedMenu, setSelectedMenu] = useState('');
    const [permissionName, setPermissionName] = useState('');
    const [open, setOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!selectedMenu || !permissionName.trim()) {
            return; // Validation - both fields required
        }

        const formData = new FormData();
        formData.append('menu', selectedMenu);
        formData.append('permission', permissionName.trim());
        
        onSubmit(formData);
        handleClose();
    }

    const handleClose = () => {
        setSelectedMenu('');
        setPermissionName('');
        setOpen(false);
        if (onClose) onClose();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild disabled={permissions.length == 0 || menus.length == 0}>
                <Button variant="outline" className="bg-primary text-white" type="button">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Permission
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Permission</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="menu-select">Select Menu</Label>
                        <Select 
                            value={selectedMenu} 
                            onValueChange={setSelectedMenu}
                        >
                            <SelectTrigger id="menu-select">
                                <SelectValue placeholder="Choose a menu..." />
                            </SelectTrigger>
                            <SelectContent>
                                {menus && menus.length > 0 ? (
                                    menus.map((menu, index) => (
                                        <SelectItem key={index} value={menu}>
                                            {menu}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="" disabled>
                                        No menus available
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="permission-input">Permission Name</Label>
                        <Input
                            id="permission-input"
                            type="text"
                            placeholder="Enter permission name..."
                            value={permissionName}
                            onChange={(e) => setPermissionName(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter className="justify-end space-x-2">
                    <DialogClose asChild>
                        <Button 
                            variant="outline" 
                            className="bg-secondary text-white" 
                            type="button" 
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button 
                        onClick={handleSubmit}
                        disabled={!selectedMenu || !permissionName.trim()}
                    >
                        Submit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ModalPermission