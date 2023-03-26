import { addGlobalEventListener } from "./utils/addGlobalEvent";

const tooltipContainer = document.createElement("div");
tooltipContainer.classList.add("tooltip-container");
document.body.append(tooltipContainer);
const DEFAULT_SPACING = 5;
const POSITION_TOOLTIP = ["top", "bottom", "left", "right"];
const POSITION_TO_FUNCTION_MAP = {
  top: positionTooltipTop,
  bottom: positionTooltipBottom,
  left: positionTooltipLeft,
  right: positionTooltipRight,
};
//Hover over tooltip
addGlobalEventListener("mouseover", "[data-tooltip]", (e) => {
  const tooltip = createTooltipElement(e.target.dataset.tooltip);
  tooltipContainer.append(tooltip);
  positionTooltip(tooltip, e.target);

  e.target.addEventListener(
    "mouseleave",
    () => {
      tooltip.remove();
    },
    { once: true }
  );
});

function createTooltipElement(text) {
  const tooltip = document.createElement("div");
  tooltip.classList.add("tooltip");
  tooltip.innerText = text;
  return tooltip;
}

function positionTooltip(tooltip, element) {
  const elementRec = element.getBoundingClientRect();
  const spacing = parseInt(element.dataset.spacing) || DEFAULT_SPACING;
  const preferredPositions = element.dataset.positions.split("|");
  const positions = preferredPositions.concat(POSITION_TOOLTIP);

  for (let i = 0; i < positions.length; i++) {
    const func = POSITION_TO_FUNCTION_MAP[positions[i]];
    if (func(tooltip, elementRec, spacing)) return;
  }
}

function positionTooltipTop(tooltip, elementRec, spacing) {
  const tooltipRec = tooltip.getBoundingClientRect();
  tooltip.style.top = `${elementRec.top - tooltipRec.height - spacing}px`;
  tooltip.style.left = `${
    elementRec.left + elementRec.width / 2 - tooltipRec.width / 2
  }px`;
  const bounds = isOutOfBounds(tooltip, spacing);
  if (bounds.top) {
    resetTooltipPosition(tooltip);
    return false;
  }
  if (bounds.right) {
    tooltip.style.right = `${spacing}px`;
    tooltip.style.left = "initial";
  }
  if (bounds.left) {
    tooltip.style.left = `${spacing}px`;
  }

  return true;
}

function positionTooltipBottom(tooltip, elementRec, spacing) {
  const tooltipRec = tooltip.getBoundingClientRect();
  tooltip.style.top = `${elementRec.bottom + spacing}px`;
  tooltip.style.left = `${
    elementRec.left + elementRec.width / 2 - tooltipRec.width / 2
  }px`;
  const bounds = isOutOfBounds(tooltip, spacing);
  if (bounds.bottom) {
    resetTooltipPosition(tooltip);
    return false;
  }
  if (bounds.right) {
    tooltip.style.right = `${spacing}px`;
    tooltip.style.left = "initial";
  }
  if (bounds.left) {
    tooltip.style.left = `${spacing}px`;
  }

  return true;
}

function positionTooltipLeft(tooltip, elementRec, spacing) {
  const tooltipRec = tooltip.getBoundingClientRect();
  tooltip.style.top = `${
    elementRec.top + elementRec.height / 2 - tooltipRec.height / 2
  }px`;
  tooltip.style.left = `${elementRec.left - tooltipRec.width - spacing}px`;
  const bounds = isOutOfBounds(tooltip, spacing);
  if (bounds.left) {
    resetTooltipPosition(tooltip);
    return false;
  }
  if (bounds.bottom) {
    tooltip.style.bottom = `${spacing}px`;
    tooltip.style.top = "initial";
  }
  if (bounds.top) {
    tooltip.style.top = `${spacing}px`;
  }

  return true;
}

function positionTooltipRight(tooltip, elementRec, spacing) {
  const tooltipRec = tooltip.getBoundingClientRect();
  tooltip.style.top = `${
    elementRec.top + elementRec.height / 2 - tooltipRec.height / 2
  }px`;
  tooltip.style.left = `${elementRec.right + spacing}px`;
  const bounds = isOutOfBounds(tooltip, spacing);

  if (bounds.right) {
    resetTooltipPosition(tooltip);
    return false;
  }
  if (bounds.bottom) {
    tooltip.style.bottom = `${spacing}px`;
    tooltip.style.top = "initial";
  }
  if (bounds.top) {
    tooltip.style.top = `${spacing}px`;
  }

  return true;
}

function resetTooltipPosition(element) {
  element.style.top = "initial";
  element.style.bottom = "initial";
  element.style.left = "initial";
  element.style.right = "initial";
}

function isOutOfBounds(element, spacing) {
  const tooltipRec = element.getBoundingClientRect();
  const tooltipContainerRec = tooltipContainer.getBoundingClientRect();

  return {
    top: tooltipRec.top <= tooltipContainerRec.top + spacing,
    bottom: tooltipRec.bottom >= tooltipContainerRec.bottom - spacing,
    left: tooltipRec.left <= tooltipContainerRec.left + spacing,
    right: tooltipRec.right >= tooltipContainerRec.right - spacing,
  };
}
