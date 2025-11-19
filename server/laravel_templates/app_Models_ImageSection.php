<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImageSection extends Model
{
    use HasFactory;

    protected $table = 'images';

    protected $fillable = [
        'section', 'url'
    ];
}
