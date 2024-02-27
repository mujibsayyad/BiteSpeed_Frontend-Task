import { useEffect, useState, type FC } from "react";
import { useNodes, type Node } from "reactflow";
import ChatIcon from "../icons/ChatIcon";

type SettingsPanelProps = {
  selectedNode: Node | undefined;
  onNodeUpdate: (node: Node[]) => void;
  hideTextArea: boolean;
};

const SettingsPanel: FC<SettingsPanelProps> = ({
  selectedNode,
  onNodeUpdate,
  hideTextArea,
}) => {
  const [textAreaContent, setTextAreaContent] = useState<string>("");
  const [showTextArea, setShowTextArea] = useState<boolean>(false);

  // Get the nodes from the React Flow context
  const nodes = useNodes();

  // Function to handle changes in the text area
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaContent(e.target.value);

    // Check if a node is selected
    if (selectedNode) {
      const updatedNodes = nodes.map((node) => {
        if (node.id === selectedNode?.id) {
          // Check if the value is not an empty string before updating the label
          if (e.target.value.trim() !== "") {
            return {
              ...node,
              data: { ...(node?.data as Node), label: e.target.value },
            };
          } else {
            // If the value is empty, keep the label unchanged
            return node;
          }
        }
        return node;
      });
      // Call the function to update the nodes
      onNodeUpdate(updatedNodes);
    }
  };

  // Effect to update the text area content and visibility when the selected node changes
  useEffect(() => {
    setTextAreaContent(selectedNode?.data?.label);
    setShowTextArea(Boolean(selectedNode));
  }, [selectedNode]);

  // Effect to hide the text area when hideTextArea state changes
  useEffect(() => {
    if (hideTextArea) setShowTextArea(false);
  }, [hideTextArea]);

  // Function to hide the text area when input is blurred
  const hideTextAreaInput = () => {
    setShowTextArea(false);
    setTextAreaContent("");
  };

  // Function to handle drag start events
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="settings_panel">
      {!hideTextArea && showTextArea && (
        <div className="setting_panel_header">
          <div
            className="setting_panel_header_arrow"
            onClick={hideTextAreaInput}
          >
            <span>&#8592;</span>
          </div>

          <div className="setting_panel_header_message">
            <h2>Message</h2>
          </div>
        </div>
      )}

      {!showTextArea && (
        <div
          className="btn_box"
          onDragStart={(event) => onDragStart(event, "input")}
          draggable
        >
          <button className="message_btn">
            <span>
              <ChatIcon className="chat_icon_blue" />
            </span>
            <h3>Message</h3>
          </button>
        </div>
      )}

      {!hideTextArea && showTextArea && (
        <div className="settings_panel_textarea">
          <label htmlFor="Text">Text</label>
          <textarea
            name="text"
            cols={20}
            rows={5}
            value={textAreaContent}
            onChange={handleChange}
            onBlur={hideTextAreaInput}
          ></textarea>
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;
