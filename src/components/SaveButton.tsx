import type { FC, Dispatch, SetStateAction } from "react";
import type { Node, Edge } from "reactflow";

type SaveButtonProps = {
  nodes: Node[];
  edges: Edge[];
  setError: Dispatch<SetStateAction<boolean>>;
};

const SaveButton: FC<SaveButtonProps> = ({ nodes, edges, setError }) => {
  const handleSave = () => {
    // Extracting all node IDs and source node IDs from edges
    const nodeIDs = nodes.map((node) => node.id);
    const edgeSource = edges.map((edge) => edge.source);

    // Initialize a counter to count nodes with no outgoing edges
    let count = 0;

    // Loop through each node ID
    nodeIDs.forEach((item) => {
      // If the node ID is not present in the source node IDs, increment the count
      if (!edgeSource.includes(item)) count++;
    });

    if (count >= 2) {
      setError(true);
      return false;
    }

    setError(false);
    return null;
  };

  return (
    <button className="save_btn" onClick={handleSave}>
      Save Changes
    </button>
  );
};

export default SaveButton;
