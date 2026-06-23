const EXPIRATION_TIME_MS = 15 * 60 * 1000;
const PAGE_URL = window.location.href;

function initTrailheadTracker() {
    const steps = document.querySelectorAll(
        '.unit-content ol li, .unit-content ul li, ' +
        '.th-challenge__requirements-content ol li, .th-challenge__requirements-content ul li'
    );
    if (steps.length === 0) return;

    chrome.storage.local.get([PAGE_URL], (result) => {
        let savedData = result[PAGE_URL];
        let checkedIndexes = [];

        if (savedData) {
            const currentTime = Date.now();
            if (currentTime - savedData.timestamp > EXPIRATION_TIME_MS) {
                chrome.storage.local.remove(PAGE_URL);
            } else {
                checkedIndexes = savedData.indexes || [];
            }
        }

        steps.forEach((step, globalIndex) => {
            if (step.querySelector('.th-tracker-checkbox')) return;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'th-tracker-checkbox';

            checkbox.style.display = 'inline-block';
            checkbox.style.verticalAlign = 'middle';
            checkbox.style.marginRight = '10px';
            checkbox.style.cursor = 'pointer';
            checkbox.style.transform = 'scale(1.1)';

            const textWrapper = document.createElement('span');
            textWrapper.className = 'th-tracker-text';
            textWrapper.style.display = 'inline';
            textWrapper.style.verticalAlign = 'middle';
            textWrapper.style.cursor = 'pointer';
            
            const nodesToWrap = [];
            for (let child of step.childNodes) {
                if (child.nodeName === 'UL' || child.nodeName === 'OL') {
                    break;
                }
                nodesToWrap.push(child);
            }

            if (nodesToWrap.length > 0) {
                step.insertBefore(textWrapper, nodesToWrap[0]);
                nodesToWrap.forEach(node => {
                    textWrapper.appendChild(node);
                });
            } else {
                if (step.firstChild) step.insertBefore(textWrapper, step.firstChild);
            }

            function setElementStyle(wrapper, isChecked) {
                if (isChecked) {
                    wrapper.style.opacity = '0.35';
                    wrapper.style.textDecoration = 'line-through';
                    wrapper.style.transition = 'all 0.15s ease';
                } else {
                    wrapper.style.opacity = '1';
                    wrapper.style.textDecoration = 'none';
                }
            }

            if (checkedIndexes.includes(globalIndex)) {
                checkbox.checked = true;
                setElementStyle(textWrapper, true);
            }

            function saveCurrentProgress() {
                const allBoxes = document.querySelectorAll('.th-tracker-checkbox');
                const currentCheckedIndexes = [];

                allBoxes.forEach((box, idx) => {
                    if (box.checked) currentCheckedIndexes.push(idx);
                });

                if (currentCheckedIndexes.length > 0) {
                    chrome.storage.local.set({
                        [PAGE_URL]: {
                            indexes: currentCheckedIndexes,
                            timestamp: Date.now()
                        }
                    });
                } else {
                    chrome.storage.local.remove(PAGE_URL);
                }
            }

            function checkPreviousStepsInCurrentList(clickedStep, targetState) {
                const parentList = clickedStep.closest('ol, ul');
                if (!parentList) return;

                const listItems = Array.from(parentList.children).filter(el => el.tagName === 'LI');
                const currentIndex = listItems.indexOf(clickedStep);

                for (let i = 0; i <= currentIndex; i++) {
                    const currentItem = listItems[i];
                    const currentBox = currentItem.querySelector(':scope > .th-tracker-checkbox');
                    const currentText = currentItem.querySelector(':scope > .th-tracker-text');

                    if (currentBox && currentText) {
                        currentBox.checked = targetState;
                        setElementStyle(currentText, targetState);
                    }
                }
                saveCurrentProgress();
            }

            function updateParentListState(childStep) {
                const parentList = childStep.parentElement.closest('ul, ol');
                if (!parentList) return;

                const parentListItem = parentList.closest('li');
                if (!parentListItem) return;

                const parentCheckbox = parentListItem.querySelector(':scope > .th-tracker-checkbox');
                const parentText = parentListItem.querySelector(':scope > .th-tracker-text');

                if (parentCheckbox && parentText) {
                    const allSubBoxes = parentList.querySelectorAll('.th-tracker-checkbox');
                    const checkedSubBoxes = parentList.querySelectorAll('.th-tracker-checkbox:checked');

                    if (allSubBoxes.length === checkedSubBoxes.length) {
                        parentCheckbox.checked = true;
                        setElementStyle(parentText, true);
                    } else {
                        parentCheckbox.checked = false;
                        setElementStyle(parentText, false);
                    }
                    saveCurrentProgress();
                    updateParentListState(parentListItem);
                }
            }

            textWrapper.addEventListener('click', (e) => {
                const clickedTag = e.target.tagName;
                if (clickedTag === 'IMG' || clickedTag === 'A') return;

                const selection = window.getSelection().toString();
                if (selection && selection.length > 0) return;

                const nextState = !checkbox.checked;

                if (nextState === true) {
                    checkPreviousStepsInCurrentList(step, true);
                    updateParentListState(step);
                } else {
                    checkbox.checked = false;
                    setElementStyle(textWrapper, false);
                    saveCurrentProgress();
                    updateParentListState(step);
                }
            });

            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();

                if (e.target.checked) {
                    checkPreviousStepsInCurrentList(step, true);
                    updateParentListState(step);
                } else {
                    setElementStyle(textWrapper, false);
                    saveCurrentProgress();
                    updateParentListState(step);
                }
            });

            step.insertBefore(checkbox, step.firstChild);
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTrailheadTracker);
} else {
    initTrailheadTracker();
}

const observer = new MutationObserver(() => {
    initTrailheadTracker();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
