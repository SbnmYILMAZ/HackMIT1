import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Path to the pygame game
    const gamePath = path.join(process.cwd(), 'game', 'main.py');
    
    // Launch the pygame game as a separate process
    const gameProcess = spawn('python', [gamePath], {
      detached: true,
      stdio: 'ignore'
    });

    // Don't wait for the game to finish
    gameProcess.unref();

    return NextResponse.json({ 
      success: true, 
      message: 'Game launched successfully!' 
    });
  } catch (error) {
    console.error('Error launching game:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to launch game. Make sure Python and pygame are installed.' 
    }, { status: 500 });
  }
}
