import pygame
import random

WIDTH, HEIGHT = 300, 600
CELL_SIZE = 30
COLS, ROWS = WIDTH // CELL_SIZE, HEIGHT // CELL_SIZE

SHAPES = [
    [[1, 1, 1, 1]],
    [[1, 1], [1, 1]],
    [[0, 1, 1], [1, 1, 0]],
    [[1, 1, 0], [0, 1, 1]],
    [[1, 0, 0], [1, 1, 1]],
    [[0, 0, 1], [1, 1, 1]],
]
COLORS = [(0, 255, 255), (255, 255, 0), (255, 165, 0), (0, 255, 0), (0, 0, 255), (255, 0, 255)]

class Piece:
    def __init__(self, shape):
        self.shape = shape
        self.x = COLS // 2 - len(shape[0]) // 2
        self.y = 0

    def rotate(self):
        self.shape = list(zip(*self.shape[::-1]))

class Board:
    def __init__(self):
        self.grid = [[0] * COLS for _ in range(ROWS)]
        self.score = 0
        self.level = 1

    def lock_piece(self, piece, color):
        for dy, row in enumerate(piece.shape):
            for dx, val in enumerate(row):
                if val:
                    self.grid[piece.y + dy][piece.x + dx] = color
        self.clear_lines()

    def clear_lines(self):
        new_grid = [row for row in self.grid if any(cell == 0 for cell in row)]
        cleared = ROWS - len(new_grid)
        if cleared:
            self.score += cleared * 100
            new_grid = [[0] * COLS for _ in range(cleared)] + new_grid
            self.grid = new_grid
            self.level = 1 + self.score // 1000

    def valid(self, piece, dx=0, dy=0):
        for y, row in enumerate(piece.shape):
            for x, val in enumerate(row):
                if val:
                    nx = piece.x + x + dx
                    ny = piece.y + y + dy
                    if nx < 0 or nx >= COLS or ny >= ROWS or self.grid[ny][nx]:
                        return False
        return True

pygame.init()
screen = pygame.display.set_mode((WIDTH, HEIGHT))
clock = pygame.time.Clock()
board = Board()
piece = Piece(random.choice(SHAPES))
color = random.choice(COLORS)
fall_time = 0
fall_speed = 1000
running = True

while running:
    delta = clock.tick(60)
    fall_time += delta
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_LEFT and board.valid(piece, dx=-1):
                piece.x -= 1
            elif event.key == pygame.K_RIGHT and board.valid(piece, dx=1):
                piece.x += 1
            elif event.key == pygame.K_DOWN and board.valid(piece, dy=1):
                piece.y += 1
            elif event.key == pygame.K_UP:
                piece.rotate()
                if not board.valid(piece):
                    piece.rotate()
                    piece.rotate()
                    piece.rotate()
    if fall_time > fall_speed - (board.level - 1) * 50:
        if board.valid(piece, dy=1):
            piece.y += 1
        else:
            board.lock_piece(piece, color)
            piece = Piece(random.choice(SHAPES))
            color = random.choice(COLORS)
            if not board.valid(piece):
                running = False
        fall_time = 0
    screen.fill((0, 0, 0))
    for y, row in enumerate(board.grid):
        for x, val in enumerate(row):
            if val:
                pygame.draw.rect(screen, val, (x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE))
    for y, row in enumerate(piece.shape):
        for x, val in enumerate(row):
            if val:
                pygame.draw.rect(screen, color, ((piece.x + x) * CELL_SIZE, (piece.y + y) * CELL_SIZE, CELL_SIZE, CELL_SIZE))
    font = pygame.font.SysFont('Arial', 18)
    score_text = font.render(f'Score: {board.score}', True, (255, 255, 255))
    level_text = font.render(f'Level: {board.level}', True, (255, 255, 255))
    screen.blit(score_text, (10, 10))
    screen.blit(level_text, (10, 30))
    pygame.display.flip()

pygame.quit()
