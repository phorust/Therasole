// implicit:
// if (Meteor.isClient) {
// golly isn't meteor such dandy software?

Template.landing.helpers({
  tasks: _ => {
    if (Session.get("hideCompleted")) {
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 }});
    } else {
      return Tasks.find({}, { sort: { createdAt: -1 } });
    }
  },
  hideCompleted: function() {
    return Session.get("hideCompleted");
  }
});

Template.landing.events({
  "submit .new-task": event => {
    event.preventDefault();
    var text = event.target.text.value;

    Tasks.insert({
      text,
      createdAt: new Date()
    });

    event.target.text.value = "";
  },
  "change .hide-completed input": event => {
    Session.set("hideCompleted", event.target.checked);
  }
});

Template.task.events({
  "click .toggle-checked": function() {
    Tasks.update(this._id, {
      $set: { checked: ! this.checked }
    });
  },
  "click .delete": function() {
    Tasks.remove(this._id);
  }
});