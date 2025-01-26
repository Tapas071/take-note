
import dbConnect from "@/lib/DbConnect";
import { Note } from "@/model/Note";
import { NextRequest, NextResponse } from "next/server";
// import { Note } from "@/models/Note";
// import { DbConnect } from "@/lib/DbConnect";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();

    // Hardcoded user ID for now
    const userId = "123";

    const newNote = new Note({
      ...data,
      user: userId,
    });

    await newNote.save();
    return NextResponse.json(newNote, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error creating note" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // const notes = "some notes";
    // // Hardcoded user ID for now
    const userId = "123";

    const notes = await Note.find({ user: userId });
    if(!notes) {
      return NextResponse.json({ error: "Notes not found" }, { status: 404 });
    }
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching notes" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string[] } }
) {
  try {
    await dbConnect();
    const noteId = params.id[0];
    const data = await req.json();

    const updatedNote = await Note.findByIdAndUpdate(noteId, data, {
      new: true,
    });

    if (!updatedNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(updatedNote, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error updating note" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string[] } }
) {
  try {
    await dbConnect();
    const noteId = params.id[0];

    const deletedNote = await Note.findByIdAndDelete(noteId);

    if (!deletedNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(deletedNote, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting note" }, { status: 500 });
  }
}