class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
def insert(root, key):
    #base cond 
    if root is None:
        return TreeNode(key)
    
    #logic 
    if  key > root.value:
        root.right = insert(root.right, key)
    else: #key < root.value 
        root.left = insert(root.left, key)
    return root
def search(root, key):
    #base cond 
    if root is None: 
        return None

    #logic 
    if root.value == key:
        return root
    elif key > root.value:
        return search(root.right, key)
    else: #key<root.value 
        return search(root.left, key)
def min_value_node(node):
    current = node
    while current.left is not None: 
        current = current.left
    return current
def delete_node(root, key):
    if root is None:
        return root

    if key < root.value:
        root.left = delete_node(root.left, key) 
    elif key > root.value:
        root.right = delete_node(root.right, key)
    else:
        #no child, single child 
        if root.left is None:
            return root.right
        elif root.right is None:
            return root.left
        #two childs 
        temp = min_value_node(root.right)
        root.value = temp.value
        root.right = delete_node(root.right, temp.value)
    return root

def inorder(root):
    if not root:
        return 
    #logic 
    inorder(root.left)
    print(root.value,end =' ')
    inorder(root.right)

#insert 60 30 70 20 40 45 80
root = insert(None,60)
insert(root,30)
insert(root,70)
insert(root,20)
insert(root,40)
insert(root,45)
insert(root,80)

print('Inorder traversal:')
inorder(root)

min_node = min_value_node(root)
print(f'\nMin value:{min_node.value}')

node1 = search(root,30)
node2 = search(root,45)
node3 = search(root,35)

if node1:
    print(f'Searched node:{node1.value}')
if node2:
    print(f'Searched node:{node2.value}')
if node3:
    print(f'Searched node:{node3.value}')
else:
    print('the key 35 is not found')

delete_node(root,20)
print('\nInorder traversal(after delete of 20):')
inorder(root)
delete_node(root,40)
print('\nInorder traversal(after delete of 40):')
inorder(root)
delete_node(root,60)
print('\nInorder traversal(after delete of 60):')
inorder(root)