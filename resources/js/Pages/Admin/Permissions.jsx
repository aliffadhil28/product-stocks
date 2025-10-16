import LucideIcon from '@/Components/LucideIcons';
import { Button } from '@/Components/ui/button';
import { fetchPost } from '@/hooks/Api';
import DashboardLayout from '@/Layouts/DashboardLayout';
import React, { useEffect, useState } from 'react';
import ModalMenu from './Permissions/ModalMenu';
import ModalPermission from './Permissions/ModalPermission';
import { toast } from 'sonner';

const Permissions = () => {
    const [selectedRole, setSelectedRole] = useState(null);
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [groupMenus, setGroupMenus] = useState([]);
    const [menus, setMenus] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('permission'); // 'permission' or 'menu'
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, type: '', key: '', name: '' });

    // Fungsi untuk convert array string jadi tree
    function buildTree(data) {
        const tree = {};

        data.forEach(path => {
            const parts = path.split("/");
            let current = tree;

            parts.forEach((part, index) => {
                if (!current[part]) {
                    current[part] = {
                        key: parts.slice(0, index + 1).join("/"),
                        title: part,
                        children: {}
                    };
                }
                current = current[part].children;
            });
        });

        function format(node) {
            return Object.values(node).map(({ key, title, children }) => ({
                key,
                title,
                children: format(children)
            }));
        }

        return format(tree);
    }

    const treeData = buildTree(permissions);

    // Fungsi untuk mengumpulkan semua key dari node dan children-nya
    const collectAllKeys = (node) => {
        let keys = [node.key];
        if (node.children && node.children.length > 0) {
            node.children.forEach(child => {
                keys = keys.concat(collectAllKeys(child));
            });
        }
        return keys;
    };

    // Fungsi untuk mencari node berdasarkan key
    const findNodeByKey = (nodes, targetKey) => {
        for (const node of nodes) {
            if (node.key === targetKey) {
                return node;
            }
            if (node.children && node.children.length > 0) {
                const found = findNodeByKey(node.children, targetKey);
                if (found) return found;
            }
        }
        return null;
    };

    // Fungsi untuk menghapus node dari tree
    const removeNodeByKey = (nodes, targetKey) => {
        return nodes.filter(node => {
            if (node.key === targetKey) {
                return false; // Hapus node ini
            }
            if (node.children && node.children.length > 0) {
                node.children = removeNodeByKey(node.children, targetKey);
            }
            return true;
        });
    };

    // Fungsi untuk menghapus permission dari state permissions
    const removePermission = (key) => {
        const newPermissions = permissions.filter(permission => !permission.startsWith(key));
        setPermissions(newPermissions);

        // Juga hapus dari checkedKeys jika ada
        const keysToRemove = collectAllKeys(findNodeByKey(treeData, key) || {});
        const newCheckedKeys = checkedKeys.filter(k => !keysToRemove.includes(k));
        setCheckedKeys(newCheckedKeys);

        return newPermissions;
    };

    // Fungsi untuk menghapus tree (root node)
    const removeTree = (key) => {
        const newPermissions = permissions.filter(permission => !permission.startsWith(key));
        setPermissions(newPermissions);

        // Juga hapus dari checkedKeys jika ada
        const keysToRemove = collectAllKeys(findNodeByKey(treeData, key) || {});
        const newCheckedKeys = checkedKeys.filter(k => !keysToRemove.includes(k));
        setCheckedKeys(newCheckedKeys);

        return newPermissions;
    };

    // Handler untuk konfirmasi delete
    const handleDelete = (type, key, name) => {
        setDeleteConfirm({ show: true, type, key, name });
    };

    // Handler untuk eksekusi delete
    const confirmDelete = async () => {
        const { type, key } = deleteConfirm;
        
        const newPermissions = removeTree(key);
        try {
            let method;
            let payload = {};
            if (type === 'node') {
                method = 'deletePermission'

                payload = {
                    permission: key,
                    permissions: newPermissions
                }
            } else if (type === 'tree') {
                // Hapus tree dari permissions

                method = 'deleteMenu'

                payload = {
                    menu: key,
                    permissions: newPermissions
                }
            }

            const response = await fetchPost('PermissionController', method, payload);

            if(response){
                toast.success(response.message)
            }
            
            // Refresh data
            fetchData();

            // Tutup konfirmasi
            setDeleteConfirm({ show: false, type: '', key: '', name: '' });
        } catch (error) {
            toast.error(error.message)
            console.error('Error deleting permission:', error);
        }
    };
    // Simple Tree Component
    const TreeNode = ({ node, level = 0, onToggle, onCheck, expandedKeys, checkedKeys, onDelete }) => {
        const isExpanded = expandedKeys.includes(node.key);
        const isChecked = checkedKeys.includes(node.key);
        const hasChildren = node.children && node.children.length > 0;

        // Cek apakah semua children sudah checked (untuk indeterminate state)
        const allChildrenChecked = hasChildren ?
            node.children.every(child => {
                const childKeys = collectAllKeys(child);
                return childKeys.every(key => checkedKeys.includes(key));
            }) : false;

        const someChildrenChecked = hasChildren ?
            node.children.some(child => {
                const childKeys = collectAllKeys(child);
                return childKeys.some(key => checkedKeys.includes(key));
            }) : false;

        // Tentukan apakah ini root node (tree) atau child node
        const isRootNode = level === 0;

        return (
            <div className="tree-node group">
                <div
                    className={`flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded`}
                    style={{ paddingLeft: `${level * 20 + 8}px` }}
                >
                    {hasChildren && (
                        <button
                            onClick={() => onToggle(node.key)}
                            className="mr-2 w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                            {isExpanded ? '−' : '+'}
                        </button>
                    )}
                    {!hasChildren && <div className="w-6"></div>}

                    <input
                        type="checkbox"
                        checked={isChecked || allChildrenChecked}
                        ref={input => {
                            if (input) {
                                input.indeterminate = !isChecked && someChildrenChecked && hasChildren;
                            }
                        }}
                        onChange={() => onCheck(node.key, !isChecked)}
                        className="mr-2"
                    />

                    <span className="text-sm text-gray-900 dark:text-gray-100 flex-grow">
                        {node.title}
                        {hasChildren && (
                            <span className="text-xs text-gray-500 ml-1">
                                ({node.children.length})
                            </span>
                        )}
                    </span>

                    {/* Tombol Delete */}
                    <button
                        onClick={() => onDelete(isRootNode ? 'tree' : 'node', node.key, node.title)}
                        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                        title={`Delete ${isRootNode ? 'Tree' : 'Node'}`}
                    >
                        <LucideIcon name="Trash2" className="w-4 h-4" />
                    </button>
                </div>

                {hasChildren && isExpanded && (
                    <div className="tree-children">
                        {node.children.map(child => (
                            <TreeNode
                                key={child.key}
                                node={child}
                                level={level + 1}
                                onToggle={onToggle}
                                onCheck={onCheck}
                                onDelete={onDelete}
                                expandedKeys={expandedKeys}
                                checkedKeys={checkedKeys}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const SimpleTree = ({ treeData, expandedKeys, checkedKeys, onExpand, onCheck, onDelete }) => {
        const handleToggle = (key) => {
            const newExpandedKeys = expandedKeys.includes(key)
                ? expandedKeys.filter(k => k !== key)
                : [...expandedKeys, key];
            onExpand(newExpandedKeys);
        };

        const handleCheck = (key, isChecking) => {
            const targetNode = findNodeByKey(treeData, key);
            if (!targetNode) return;

            // Kumpulkan semua keys yang akan diubah (node + children)
            const allAffectedKeys = collectAllKeys(targetNode);

            let newCheckedKeys;
            if (isChecking) {
                // Jika checking, tambahkan semua keys
                newCheckedKeys = [...new Set([...checkedKeys, ...allAffectedKeys])];
            } else {
                // Jika unchecking, hapus semua keys
                newCheckedKeys = checkedKeys.filter(k => !allAffectedKeys.includes(k));
            }

            onCheck(newCheckedKeys);
        };

        const handleDelete = (type, key, name) => {
            onDelete(type, key, name);
        };

        return (
            <div className="tree-container">
                {treeData.map(node => (
                    <TreeNode
                        key={node.key}
                        node={node}
                        onToggle={handleToggle}
                        onCheck={handleCheck}
                        onDelete={handleDelete}
                        expandedKeys={expandedKeys}
                        checkedKeys={checkedKeys}
                    />
                ))}
            </div>
        );
    };

    const [expandedKeys, setExpandedKeys] = useState(['products', 'permissions', 'dashboard', 'users']);
    const [checkedKeys, setCheckedKeys] = useState([]);

    const onExpand = (keys) => {
        setExpandedKeys(keys);
    };

    const onCheck = (keys) => {
        setCheckedKeys(keys);
    };

    // Fungsi untuk quick select semua permissions
    const selectAllPermissions = () => {
        const allKeys = treeData.reduce((acc, node) => {
            return acc.concat(collectAllKeys(node));
        }, []);
        setCheckedKeys(allKeys);
    };

    const clearAllPermissions = () => {
        setCheckedKeys([]);
    };

    // Load permissions untuk role yang dipilih (simulasi)
    const loadRolePermissions = (role) => {
        setSelectedRole(role);
        // Simulasi load permissions berdasarkan role
        const rolePermission = roles.filter(r => r.id === role.id).flatMap(r => r.permissions) || [];

        setCheckedKeys(rolePermission);
    };

    const fetchData = async () => {
        try {
            const response = await fetchPost('PermissionController', 'index', {});
            if (response) {
                setPermissions(response?.permissions);
                setRoles(response?.roles);
                setMenus(response?.menus);
                setGroupMenus(response?.groupMenus || []);
            }
        } catch (error) {
            console.error('Error fetching permissions:', error);
        }
    };

    const handleSavePermission = async (formData) => {
        try {
            const response = await fetchPost('PermissionController', 'storePermission', formData);
            if(response) {
                toast.success(response.message || 'Permission saved successfully');
                fetchData(); // Refresh data setelah menyimpan
            }
        } catch (error) {
            toast.error(`Error saving permission: ${error.message}`);
            console.error('Permission save error:', error);
        }
    };

    const handleSaveMenu = async (formData) => {
        try {
            const menuData = {
                name: formData.get('menuName'),
                path: formData.get('menuPath'),
                icon: formData.get('menuIcon'),
                level: formData.get('level')
            };

            // Handle Level 2 menus (child menus)
            if (formData.get('level') === '2') {
                if (formData.get('isNewGroup') === 'true') {
                    // Create new group first
                    const newGroupData = {
                        name: formData.get('groupName'),
                        icon: formData.get('groupIcon')
                    };

                    try {
                        // Call API to create new group
                        const groupResponse = await fetchPost('PermissionController', 'storeGroup', newGroupData);

                        if (groupResponse && groupResponse.data) {
                            // Use the newly created group ID
                            menuData.group_id = groupResponse.data.id;
                            toast.success(groupResponse.message || 'Group created successfully');
                        } else {
                            throw new Error('Failed to create new group');
                        }
                    } catch (groupError) {
                        toast.error(`Error creating group: ${groupError.message}`);
                        return; // Stop execution if group creation fails
                    } finally {
                        const response = await fetchPost('PermissionController', 'storeMenu', menuData);

                        if (response) {
                            toast.success(response.message || 'Menu saved successfully');
                            fetchData(); // Refresh data setelah menyimpan
                        }
                    }
                } else {
                    // Use existing group
                    menuData.group_id = parseInt(formData.get('groupId'));
                }
            }

            // Create the menu
            const response = await fetchPost('PermissionController', 'storeMenu', menuData);

            if (response) {
                toast.success(response.message || 'Menu saved successfully');
                fetchData(); // Refresh data setelah menyimpan
            }
        } catch (error) {
            toast.error(`Error saving menu: ${error.message}`);
            console.error('Menu save error:', error);
        }
    };

    const saveAllRolePermissions = async () => {
        try {
            const response = await fetchPost('PermissionController', 'saveRolePermissions',
                {
                    'permissions' : checkedKeys.filter((item) => item.includes('/')),
                    'role' : selectedRole.name
                }
            );

            if (response) {
                toast.success(response.message || 'Role permissions saved successfully');
                fetchData(); // Refresh data setelah menyimpan
            }
        } catch (error) {
            toast.error(`Error saving role permissions: ${error.message}`);
            console.error('Role permissions save error:', error);
        }
    }

    useEffect(() => {
        // Simulasi fetch permissions dari API
        fetchData();
    }, []);

    return (
        <DashboardLayout header={"Permissions"}>
            <div className="min-h-screen p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-row justify-between items-center mb-3">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Permissions List</h2>
                        <div className="flex">
                            <ModalMenu
                                onClose={() => setShowModal(false)}
                                onSubmit={handleSaveMenu}
                                groupMenus={groupMenus}
                            />
                            <ModalPermission
                                onClose={() => setShowModal(false)}
                                onSubmit={handleSavePermission}
                                permissions={permissions}
                                menus={menus}
                            />
                            {/* <Button
                                variant="outline"
                                onClick={() => {
                                    setModalType('menu');
                                    setShowModal(true);
                                }}
                                className="text-xs bg-primary hover:bg-opacity-80 text-white hover:text-gray-200 px-2 py-1 rounded-md mr-2 flex items-center"
                            >
                                <LucideIcon name="Plus" className="w-4 h-4 inline-block mr-1" />
                                Add Menu
                            </Button> */}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        {/* Roles list */}
                        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                            <h2 className="text-md text-gray-900 font-semibold dark:text-gray-100 mb-2">Roles</h2>
                            <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>
                            <div className="flex flex-col space-y-2">
                                {roles.map(role => {
                                    const roleName = role.name.charAt(0).toUpperCase() + role.name.slice(1).toLowerCase();
                                    return (
                                        <button
                                            key={role.id}
                                            onClick={() => loadRolePermissions(role)}
                                            className={`px-4 py-2 rounded transition-colors text-left ${selectedRole?.id === role.id
                                                ? 'bg-primary text-white'
                                                : 'bg-gray-50 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                }`}
                                        >
                                            {roleName}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Permissions tree */}
                        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 col-span-3">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-md text-gray-900 font-semibold dark:text-gray-100">
                                    {selectedRole ? `Permissions for ${selectedRole.name}` : 'Select a role to view permissions'}
                                </h2>
                                {selectedRole && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={selectAllPermissions}
                                            className="text-xs bg-green-100 hover:bg-green-200 text-green-800 px-2 py-1 rounded"
                                        >
                                            Select All
                                        </button>
                                        <button
                                            onClick={clearAllPermissions}
                                            className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded"
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>

                            <div className="max-h-96 overflow-y-auto">
                                <SimpleTree
                                    treeData={treeData}
                                    expandedKeys={expandedKeys}
                                    checkedKeys={checkedKeys}
                                    onExpand={onExpand}
                                    onCheck={onCheck}
                                    onDelete={handleDelete}
                                />
                            </div>

                            {selectedRole && (
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex gap-2">
                                        <button onClick={saveAllRolePermissions} className="bg-primary text-white px-4 py-2 rounded transition-colors">
                                            Save Changes
                                        </button>
                                        <button className="bg-secondary hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors">
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Debug info */}
                    <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded">
                        <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Debug Info:</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Selected Role: {selectedRole?.name || 'None'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Expanded Keys: {expandedKeys.join(', ')}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Checked Keys ({checkedKeys.length}): {checkedKeys.join(', ')}
                        </p>
                        <div className="mt-2">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected Permissions:</h4>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 max-h-20 overflow-y-auto">
                                {checkedKeys.length > 0 ? (
                                    <ul className="list-disc list-inside">
                                        {checkedKeys.map(key => (
                                            <li key={key}>{key}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No permissions selected</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Konfirmasi Delete */}
                {deleteConfirm.show && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Confirm Delete
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Are you sure you want to delete {deleteConfirm.type} "{deleteConfirm.name}"?
                                {deleteConfirm.type === 'tree' && ' This will also delete all its children.'}
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setDeleteConfirm({ show: false, type: '', key: '', name: '' })}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Permissions;