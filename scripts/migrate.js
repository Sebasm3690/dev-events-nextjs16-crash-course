const mongoose = require('mongoose');

async function migrate() {
  await mongoose.connect(
    'mongodb+srv://anonblade10_db_user:Awayouname11@cluster0.vt0uun6.mongodb.net/?appName=Cluster0',
    { dbName: 'devevents' },
  );
  const collection = mongoose.connection.db.collection('events');
  const events = await collection.find({}).toArray();

  for (const event of events) {
    let updated = false;
    let newTags = event.tags;
    let newAgenda = event.agenda;

    if (
      event.tags &&
      event.tags.length === 1 &&
      typeof event.tags[0] === 'string' &&
      event.tags[0].startsWith('[')
    ) {
      try {
        newTags = JSON.parse(event.tags[0]);
        updated = true;
      } catch (e) {
        console.error('Failed to parse tags for', event._id);
      }
    }

    if (
      event.agenda &&
      event.agenda.length === 1 &&
      typeof event.agenda[0] === 'string' &&
      event.agenda[0].startsWith('[')
    ) {
      try {
        newAgenda = JSON.parse(event.agenda[0]);
        updated = true;
      } catch (e) {
        console.error('Failed to parse agenda for', event._id);
      }
    }

    if (updated) {
      await collection.updateOne(
        { _id: event._id },
        { $set: { tags: newTags, agenda: newAgenda } },
      );
      console.log('Updated event:', event.title);
    }
  }

  console.log('Migration complete');
  process.exit(0);
}

migrate().catch(console.error);
