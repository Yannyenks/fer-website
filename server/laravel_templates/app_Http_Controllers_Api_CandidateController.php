<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Candidate;

class CandidateController extends Controller
{
    public function index()
    {
        return Candidate::orderBy('id')->get();
    }

    public function show($id)
    {
        return Candidate::findOrFail($id);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'slug' => 'required|unique:candidates,slug',
            'name' => 'required',
            'age' => 'nullable|integer',
            'origin' => 'nullable|string',
            'domain' => 'nullable|string',
            'bio' => 'nullable|string',
            'photo' => 'nullable|string',
        ]);
        $c = Candidate::create($data);
        return response()->json($c, 201);
    }

    public function update(Request $request, $id)
    {
        $c = Candidate::findOrFail($id);
        $data = $request->validate([
            'name' => 'sometimes|required',
            'age' => 'nullable|integer',
            'origin' => 'nullable|string',
            'domain' => 'nullable|string',
            'bio' => 'nullable|string',
            'photo' => 'nullable|string',
            'votes' => 'nullable|integer',
        ]);
        $c->update($data);
        return response()->json($c);
    }

    public function destroy($id)
    {
        $c = Candidate::findOrFail($id);
        $c->delete();
        return response()->json(['deleted' => true]);
    }
}
