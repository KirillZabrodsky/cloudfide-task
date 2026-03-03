export interface BaseNode {
  name: string
  type: 'file' | 'folder'
}

export interface FileNode extends BaseNode {
  type: 'file'
  size: number
}

export interface FolderNode extends BaseNode {
  type: 'folder'
  children: TreeNode[]
}

export type TreeNode = FileNode | FolderNode

export interface IndexedNode {
  node: TreeNode
  path: string
}
