import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  addEdge,
  Position,
  MarkerType,
  useEdgesState,
  useNodesState,
  ReactFlowProvider,
  type Node,
  type Connection,
  type ReactFlowInstance,
} from "reactflow";

import { initialNodes, initialEdges } from "../data/initialData";
import { NodeHeader } from "./NodeHeader";
import SaveButton from "./SaveButton";
import SettingsPanel from "./SettingsPanel";
import "reactflow/dist/style.css";

// Node Type for custom node
const nodeTypes = { nodeHeader: NodeHeader };

// Data for drag n drop
let id = 0;
const getId = () => `dndnode_${id++}`;

const ChatbotFlowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const reactFlowWrapper = useRef(null);
  const [selectedNode, setSelectedNode] = useState<Node | undefined>(undefined);
  const [hideTextArea, setHideTextArea] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // When two nodes are connected by the user, this event fires
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            markerEnd: { type: MarkerType.ArrowClosed },
          },
          eds
        )
      ),
    [setEdges]
  );

  // Update selected node data
  const handleNodeUpdate = (updatedNodes: Node[]) => {
    setNodes(updatedNodes);
  };

  // Node Drag n Drop
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      // Check position on drop
      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      }) ?? { x: 0, y: 0 };

      // Create a new node
      const newNode: Node = {
        id: getId(),
        position,
        type: "nodeHeader",
        data: { heading: "Send message", label: "textNode" },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  // Store selected node data to state
  const onNodeClick = (_: React.MouseEvent, node: Node): void => {
    setSelectedNode(node);
  };

  // Check for selected node
  useEffect(() => {
    const isSelected = nodes.some((item) => item.selected === true);
    setHideTextArea(!isSelected);
  }, [nodes, hideTextArea]);

  return (
    <div className="main_chat_flow">
      <div className="main_chat_flow_header">
        <div className="error_container">
          {error && <span className="error">Cannot save flow</span>}
        </div>

        <div className="save_button_container">
          <SaveButton nodes={nodes} edges={edges} setError={setError} />
        </div>
      </div>

      <div className="main_react_flow">
        <ReactFlowProvider>
          <div className="react_flow_wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onNodeClick={onNodeClick}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
            ></ReactFlow>
          </div>

          <SettingsPanel
            selectedNode={selectedNode}
            onNodeUpdate={handleNodeUpdate}
            hideTextArea={hideTextArea}
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default ChatbotFlowBuilder;
