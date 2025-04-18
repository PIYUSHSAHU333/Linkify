import React from "react";

function Tooltip() {
  return (
    <div class="item-hints">
      <div class="hint" data-position="4">
        <span class="hint-radius"></span>
        <span class="hint-dot">F</span>
        <div class="hint-content do--split-children">
          <p>Features we provide</p>
        </div>
      </div>
    </div>
  );
}

export default Tooltip;
