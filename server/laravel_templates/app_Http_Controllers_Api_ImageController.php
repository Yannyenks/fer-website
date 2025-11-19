<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ImageSection;

class ImageController extends Controller
{
    public function index()
    {
        return ImageSection::orderBy('id')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'section' => 'required|string',
            'url' => 'required|string',
        ]);
        $img = ImageSection::create($data);
        return response()->json($img, 201);
    }

    public function update(Request $request, $id)
    {
        $img = ImageSection::findOrFail($id);
        $data = $request->validate([
            'section' => 'sometimes|required|string',
            'url' => 'sometimes|required|string',
        ]);
        $img->update($data);
        return response()->json($img);
    }

    public function destroy($id)
    {
        $img = ImageSection::findOrFail($id);
        $img->delete();
        return response()->json(['deleted' => true]);
    }
}
