import { useRef, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group';
import LucideIcon from '@/Components/LucideIcons';
import { InputLabel } from '@/Components/InputLabel';

const ModalMenu = ({ onClose, onSubmit, groupMenus }) => {
    const formRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [menuLevel, setMenuLevel] = useState('1');
    const [selectedGroup, setSelectedGroup] = useState('');
    const [isCreatingNewGroup, setIsCreatingNewGroup] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupIcon, setNewGroupIcon] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (menuLevel === '2' && !isCreatingNewGroup && !selectedGroup) {
            alert('Please select a group');
            return;
        }
        
        if (menuLevel === '2' && isCreatingNewGroup && (!newGroupName || !newGroupIcon)) {
            alert('Please fill in group name and icon');
            return;
        }
        
        const formData = new FormData(formRef.current);
        
        // Add additional data
        formData.append('level', menuLevel);
        if (menuLevel === '2') {
            if (isCreatingNewGroup) {
                formData.append('isNewGroup', 'true');
                formData.append('groupName', newGroupName);
                formData.append('groupIcon', newGroupIcon);
            } else {
                formData.append('isNewGroup', 'false');
                formData.append('groupId', selectedGroup);
            }
        }
        
        console.log('Form Data:', Object.fromEntries(formData)); // Debug log
        onSubmit(formData);
        handleClose();
    }

    const handleClose = () => {
        if (formRef.current) {
            formRef.current.reset();
        }
        setMenuLevel('1');
        setSelectedGroup('');
        setIsCreatingNewGroup(false);
        setNewGroupName('');
        setNewGroupIcon('');
        setOpen(false);
        if (onClose) {
            onClose();
        }
    }

    const handleLevelChange = (value) => {
        setMenuLevel(value);
        if (value === '1') {
            setSelectedGroup('');
            setIsCreatingNewGroup(false);
            setNewGroupName('');
            setNewGroupIcon('');
        }
    }

    const handleGroupSelection = (value) => {
        if (value === 'create-new') {
            setIsCreatingNewGroup(true);
            setSelectedGroup('');
        } else {
            setIsCreatingNewGroup(false);
            setSelectedGroup(value);
            setNewGroupName('');
            setNewGroupIcon('');
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild disabled={groupMenus.length == 0}>
                <Button variant="outline" className="bg-primary text-white" type="button">
                    <LucideIcon name="Plus" className="mr-2 h-4 w-4" />
                    Add Menu
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add Menu</DialogTitle>
                </DialogHeader>
                
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    {/* Menu Level Selection */}
                    <div className="space-y-3">
                        <Label htmlFor="level">Menu Level *</Label>
                        <RadioGroup 
                            value={menuLevel} 
                            onValueChange={handleLevelChange}
                            className="flex flex-row space-x-6"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1" id="level1" />
                                <Label htmlFor="level1">Level 1 (Parent)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="2" id="level2" />
                                <Label htmlFor="level2">Level 2 (Child)</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Group Selection - Only show for Level 2 */}
                    {menuLevel === '2' && (
                        <div className="space-y-3">
                            <Label htmlFor="group">Group *</Label>
                            <Select onValueChange={handleGroupSelection} value={selectedGroup || (isCreatingNewGroup ? 'create-new' : '')}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select group or create new" />
                                </SelectTrigger>
                                <SelectContent>
                                    {groupMenus && groupMenus.map((group) => (
                                        <SelectItem key={group.id} value={group.id.toString()}>
                                            {group.name}
                                        </SelectItem>
                                    ))}
                                    <SelectItem value="create-new">
                                        <div className="flex items-center">
                                            <LucideIcon name="Plus" className="mr-2 h-4 w-4" />
                                            Create New Group
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {/* New Group Creation Fields */}
                            {isCreatingNewGroup && (
                                <div className="space-y-3 p-4 border rounded-md bg-gray-50">
                                    <Label className="text-sm font-medium text-gray-700">
                                        New Group Details
                                    </Label>
                                    <div className="space-y-2">
                                        <Label htmlFor="newGroupName">Group Name *</Label>
                                        <Input
                                            id="newGroupName"
                                            value={newGroupName}
                                            onChange={(e) => setNewGroupName(e.target.value)}
                                            placeholder="Enter group name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="newGroupIcon">Group Icon *</Label>
                                        <Input
                                            id="newGroupIcon"
                                            value={newGroupIcon}
                                            onChange={(e) => setNewGroupIcon(e.target.value)}
                                            placeholder="Enter icon name (e.g., Settings, Users)"
                                        />
                                        <p className="text-xs text-gray-500">
                                            Use Lucide icon names
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Menu Details */}
                    <div className="space-y-3">
                        <div className="space-y-2">
                            <Label htmlFor="menuName">Menu Name *</Label>
                            <Input
                                id="menuName"
                                name="menuName"
                                type="text"
                                placeholder="Enter menu name"
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="menuPath">Menu Path *</Label>
                            <Input
                                id="menuPath"
                                name="menuPath"
                                type="text"
                                placeholder="/path/to/menu"
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="menuIcon">Menu Icon *</Label>
                            <Input
                                id="menuIcon"
                                name="menuIcon"
                                type="text"
                                placeholder="Enter icon name (e.g., Home, User, Settings)"
                                required
                            />
                            <p className="text-xs text-gray-500">
                                Use Lucide icon names
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="justify-end space-x-2 mt-6">
                        <Button 
                            variant="outline" 
                            className="bg-secondary text-white" 
                            type="button" 
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Submit</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ModalMenu;