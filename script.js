
let goals = JSON.parse(localStorage.getItem("careerGoals")) || [];

const goalForm = document.getElementById("goalForm");
const goalInput = document.getElementById("goalInput");
const deadlineInput = document.getElementById("deadlineInput");
const goalList = document.getElementById("goalList");

function saveGoals() {
  localStorage.setItem("careerGoals", JSON.stringify(goals));
}

function addGoal(event) {
  event.preventDefault();

  const title = goalInput.value.trim();
  const deadline = deadlineInput.value;

  if (!title || !deadline) return;

  goals.push({
    id: Date.now(),
    title: title,
    deadline: deadline,
    milestones: []
  });

  saveGoals();
  goalForm.reset();
  renderGoals();
}

function addMilestone(goalId, input) {
  const text = input.value.trim();

  if (!text) {
    alert("Please enter a milestone!");
    return;
  }

  const goal = goals.find(g => g.id === goalId);

  if (goal) {
    goal.milestones.push({
      id: Date.now(),
      text: text,
      completed: false
    });
  }

  saveGoals();
  renderGoals();
}

function toggleMilestone(goalId, milestoneId) {
  const goal = goals.find(g => g.id === goalId);

  if (!goal) return;

  const milestone = goal.milestones.find(m => m.id === milestoneId);

  if (milestone) {
    milestone.completed = !milestone.completed;
  }

  saveGoals();
  renderGoals();
}

function deleteGoal(goalId) {
  if (!confirm("Are you sure you want to delete this goal?")) return;

  goals = goals.filter(g => g.id !== goalId);
  saveGoals();
  renderGoals();
}

function editGoal(goalId) {
  const goal = goals.find(g => g.id === goalId);

  if (!goal) return;

  const updatedTitle = prompt("Edit your career goal:", goal.title);

  if (updatedTitle && updatedTitle.trim()) {
    goal.title = updatedTitle.trim();
    saveGoals();
    renderGoals();
  }
}

function deleteMilestone(goalId, milestoneId) {
  const goal = goals.find(g => g.id === goalId);

  if (!goal) return;

  goal.milestones = goal.milestones.filter(
    m => m.id !== milestoneId
  );

  saveGoals();
  renderGoals();
}

function renderGoals() {
  goalList.innerHTML = "";

  let totalMilestones = 0;
  let completedMilestones = 0;

  goals.forEach(goal => {
    const total = goal.milestones.length;
    const completed = goal.milestones.filter(
      m => m.completed
    ).length;

    totalMilestones += total;
    completedMilestones += completed;

    const progress = total === 0
      ? 0
      : Math.round((completed / total) * 100);

    const card = document.createElement("div");
    card.className = "goal-card";

    const heading = document.createElement("h3");
    heading.textContent = goal.title;

    const deadline = document.createElement("p");
    deadline.className = "deadline";
    deadline.textContent = "Target date: " + goal.deadline;

    const top = document.createElement("div");
    top.className = "goal-top";

    const info = document.createElement("div");
    info.append(heading, deadline);

    const actions = document.createElement("div");
    actions.className = "goal-actions";

    const editButton = document.createElement("button");
    editButton.className = "edit-btn";
    editButton.textContent = "Edit";
    editButton.onclick = () => editGoal(goal.id);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => deleteGoal(goal.id);

    actions.append(editButton, deleteButton);
    top.append(info, actions);

    const progressInfo = document.createElement("div");
    progressInfo.className = "progress-info";

    const progressText = document.createElement("span");
    progressText.textContent = "Progress";

    const percentage = document.createElement("strong");
    percentage.textContent = progress + "%";

    progressInfo.append(progressText, percentage);

    const bar = document.createElement("div");
    bar.className = "progress-bar";

    const fill = document.createElement("div");
    fill.className = "progress-fill";
    fill.style.width = progress + "%";

    bar.appendChild(fill);

    const milestoneList = document.createElement("div");
    milestoneList.className = "milestone-list";

    goal.milestones.forEach(milestone => {
      const item = document.createElement("div");
      item.className = "milestone";

      const label = document.createElement("label");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = milestone.completed;
      checkbox.onchange = () =>
        toggleMilestone(goal.id, milestone.id);

      const text = document.createElement("span");
      text.textContent = milestone.text;

      if (milestone.completed) {
        text.className = "completed";
      }

      label.append(checkbox, text);

      const remove = document.createElement("button");
      remove.className = "delete-btn";
      remove.textContent = "×";
      remove.onclick = () =>
        deleteMilestone(goal.id, milestone.id);

      item.append(label, remove);
      milestoneList.appendChild(item);
    });

    const milestoneForm = document.createElement("form");
    milestoneForm.className = "milestone-form";

    const milestoneInput = document.createElement("input");
    milestoneInput.type = "text";
    milestoneInput.placeholder = "Add a milestone...";
    milestoneInput.required = true;

    const addButton = document.createElement("button");
    addButton.type = "submit";
    addButton.textContent = "Add Milestone";

    milestoneForm.append(milestoneInput, addButton);

    milestoneForm.onsubmit = event => {
      event.preventDefault();
      addMilestone(goal.id, milestoneInput);
    };

    card.append(
      top,
      progressInfo,
      bar,
      milestoneList,
      milestoneForm
    );

    goalList.appendChild(card);
  });

  document.getElementById("totalGoals").textContent = goals.length;

  document.getElementById("completedMilestones").textContent =
    completedMilestones;

  const overall = totalMilestones === 0
    ? 0
    : Math.round((completedMilestones / totalMilestones) * 100);

  document.getElementById("overallProgress").textContent =
    overall + "%";

  document.getElementById("emptyMessage").style.display =
    goals.length === 0 ? "block" : "none";
}

goalForm.addEventListener("submit", addGoal);

renderGoals();
