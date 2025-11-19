<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug', 'name', 'age', 'origin', 'domain', 'bio', 'photo', 'votes'
    ];

    protected $casts = [
        'votes' => 'integer'
    ];
}
